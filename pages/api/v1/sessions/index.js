import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import authentication from "models/authentication.js";
import session from "models/session.js";

const router = createRouter();
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;
  const authenticatedUser = await authentication.getAuthenticateUser(
    userInputValues.email,
    userInputValues.password,
  );
  const newSession = await session.create(authenticatedUser.id);
  await controller.setSessionCokie(newSession.token, response);
  return response.status(201).json(newSession);
}
