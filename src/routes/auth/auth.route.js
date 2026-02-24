const { Router } = require("express");
const { expressValidate } = require("../../validators");
const { AuthController } = require("../../controllers/auth/auth.controller");
const { AuthValidator } = require("../../validators/auth/auth.validator");

const AuthRouter = Router();



AuthRouter.post(
  "/sign-up-admin",
  AuthValidator.signUpAdmin(),
  expressValidate,
  AuthController.signUpAdmin,
);

AuthRouter.post(
  "/login",
  AuthValidator.login(),
  expressValidate,
  AuthController.login,
);

module.exports = { AuthRouter };
