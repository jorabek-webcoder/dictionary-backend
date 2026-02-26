const { body, param, query } = require("express-validator");

class AuthValidator {
  static signUpAdmin = () => [
    body("name", "Name is required. ").trim().notEmpty(),
    body("name", "Name must be a string. ").isString().isAscii(),
    body("telephone", "Telephone is required. ").notEmpty(),
    body("telephone", "Telephone must be a valid mobile phone. ")
      .blacklist(" ()-")
      .matches(/^\+998(33|50|77|88|90|91|93|94|95|97|98|99)\d{7}$/),
    body("password", "Password is required. ").notEmpty(),
    body("password", "Password must be a string. ").isString(),
    body("password", "Password must be a strong password. ").isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
    body("regKey", "Registration key is required. ").notEmpty(),
    body("regKey", "Registration key must be a string. ").isString(),
  ];

  static login = () => [
    body("telephone", "Telephone is required. ").notEmpty(),
    body("telephone", "Telephone must be a valid mobile phone. ")
      .blacklist(" ()-")
      .matches(/^\+998(33|50|77|88|90|91|93|94|95|97|98|99)\d{7}$/),
    body("password", "Password is required. ").notEmpty(),
    body("password", "Password must be a string. ").isString(),
  ];

  static getSingleUser = () => [
    param("id", "User ID is required. ").notEmpty(),
    param("id", "User ID must be a valid MongoDB ObjectId. ").isMongoId(),
  ];

  static getAllUsers = () => [
    query("search", "Search must be a string. ").optional().isString(),
    query("page", "Page must be a positive integer. ")
      .optional()
      .isInt({ min: 1 }),
    query("limit", "Limit must be a positive integer. ")
      .optional()
      .isInt({ min: 1 }),
    query("role", "Role must be either 'admin' or 'user'. ")
      .optional()
      .isIn(["admin", "user"]),
  ];

  static updateMePhone = () => [
    body("newPhone", "Telephone is required. ").notEmpty(),
    body("newPhone", "Telephone must be a valid mobile phone. ")
      .blacklist(" ()-")
      .matches(/^\+998(33|50|77|88|90|91|93|94|95|97|98|99)\d{7}$/),
    body("password", "Password is required. ").notEmpty(),
  ];

  static updateMePassword = () => [
    body("newPassword", "New password is required. ").notEmpty(),
    body("newPassword", "New password must be a string. ").isString(),
    body(
      "newPassword",
      "New password must be a strong password. ",
    ).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
    body("currentPassword", "Current password is required. ").notEmpty(),
    body("currentPassword", "Current password must be a string. ").isString(),
  ];
}

module.exports = { AuthValidator };
