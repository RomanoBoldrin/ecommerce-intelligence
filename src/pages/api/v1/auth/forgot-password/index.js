import { createRouter } from "next-connect";

import controller from "@/infra/controller.js";
import { ValidationError } from "@/infra/errors.js";
import passwordReset from "@/infra/passwordReset.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function postHandler(request, response) {
  const { email } = request.body || {};

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    throw new ValidationError({
      message: "A valid email address is required.",
      action: "Check the email address provided and try again.",
    });
  }

  await passwordReset.requestPasswordReset(email);

  // Return an identical generic response to prevent account enumeration.
  // Never leak tokens, reset links, or account existence in the response or logs.
  return response.status(200).json({
    message:
      "If this email is registered, instructions to reset your password will be sent.",
  });
}
