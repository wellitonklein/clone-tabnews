import { createRouter } from "next-connect";
import controller from "infra/controller";
import session from "models/session";
import user from "models/user";

const router = createRouter();
router.get(getHandler);
export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;
  const sessionObject = await session.findOnValidByToken(sessionToken);
  const renewedSessionObject = await session.renew(sessionObject.id);
  await controller.setSessionCokie(renewedSessionObject.token, response);
  const userFound = await user.findOneById(sessionObject.user_id);
  response.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );
  return response.status(200).json(userFound);
}
