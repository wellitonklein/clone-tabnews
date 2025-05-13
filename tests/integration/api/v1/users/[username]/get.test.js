import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      await orchestrator.createUser({
        username: "MesmoCase",
        email: "mesmocase@curso.dev",
        password: "senha123",
      });

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      expect(response2.status).toBe(200);

      const responseBody = await response2.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "MesmoCase",
        email: "mesmocase@curso.dev",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      await orchestrator.createUser({
        username: "CaseDiferente",
        email: "casediferente@curso.dev",
        password: "senha123",
      });

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      expect(response2.status).toBe(200);

      const responseBody = await response2.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "CaseDiferente",
        email: "casediferente@curso.dev",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With nonexistent username", async () => {
      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      expect(response2.status).toBe(404);

      const responseBody = await response2.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username foi digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
