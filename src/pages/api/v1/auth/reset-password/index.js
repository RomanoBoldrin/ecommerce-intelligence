import { createRouter } from "next-connect";

import controller from "@/infra/controller.js";
import { ValidationError } from "@/infra/errors.js";
import passwordReset from "@/infra/passwordReset.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const { token, password } = request.body || {};

  if (!token || typeof token !== "string") {
    throw new ValidationError({
      message: "This password reset link is invalid or has expired.",
      action: "Request a new password reset link.",
    });
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    throw new ValidationError({
      message: "Password must be at least 8 characters long.",
      action: "Choose a stronger password with at least 8 characters.",
    });
  }

  await passwordReset.resetPassword({
    token,
    password,
  });

  return response.status(200).json({
    message: "Password has been successfully reset.",
  });
}
