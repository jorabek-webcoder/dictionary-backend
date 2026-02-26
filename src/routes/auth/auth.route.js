const { Router } = require("express");
const { expressValidate } = require("../../validators");
const { AuthController } = require("../../controllers/auth/auth.controller");
const { AuthValidator } = require("../../validators/auth/auth.validator");
const { AuthMiddleware } = require("../../middlewares/auth.middleware");

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

AuthRouter.get("/get-me", AuthMiddleware, AuthController.getMe);

AuthRouter.get(
  "/get-single-user/:id",
  AuthMiddleware,
  AuthValidator.getSingleUser(),
  expressValidate,
  AuthController.getSingleUser,
);

AuthRouter.get(
  "/get-all-users",
  AuthMiddleware,
  AuthValidator.getAllUsers(),
  expressValidate,
  AuthController.getAllUsers,
);

AuthRouter.patch(
  "/update-me-phone",
  AuthMiddleware,
  AuthValidator.updateMePhone(),
  expressValidate,
  AuthController.updateMePhone,
);

AuthRouter.patch(
  "/update-me-password",
  AuthMiddleware,
  AuthValidator.updateMePassword(),
  expressValidate,
  AuthController.updateMePassword,
);

AuthRouter.delete("/delete-me", AuthMiddleware, AuthController.deleteMe);

module.exports = { AuthRouter };
