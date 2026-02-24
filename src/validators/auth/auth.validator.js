const { body } = require("express-validator");

class AuthValidator {
  static signUpAdmin = () => [
    body("name", "Name is required. ").notEmpty(),
    body("name", "Name must be a string. ").isString().isAscii(),
    body("telephone", "Telephone is required. ").notEmpty(),
    body("telephone", "Telephone must be a valid mobile phone. ")
      .blacklist(" ()-")
      .matches(/^\+998(33|50|77|88|90|91|93|94|95|97|98|99)\d{7}$/), //.isMobilePhone("uz-UZ",),
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
      .matches(/^\+998(33|50|77|88|90|91|93|94|95|97|98|99)\d{7}$/), //.isMobilePhone("uz-UZ"),
    body("password", "Password is required. ").notEmpty(),
    body("password", "Password must be a string. ").isString(),
  ];
}

module.exports = { AuthValidator };
