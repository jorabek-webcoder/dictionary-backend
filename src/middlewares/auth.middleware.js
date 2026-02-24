const { StatusCodes } = require("http-status-codes");
const { HttpException } = require("../utils/http-exception");
const { verify } = require("jsonwebtoken");
const { token } = require("morgan");
const { JWT_SECRET_KEY } = require("../utils/secret");

const AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "No token provided");
  }

  const AuthToken = authHeader.split(" ")[1];

  if (!AuthToken) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "No token provided");
  }

  try {
    const decoded = verify(token, JWT_SECRET_KEY);
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Token expired. Please login again",
      );
    }
    if (err.name === "JsonWebTokenError") {
      throw new HttpException(StatusCodes.UNAUTHORIZED, "Invalid token");
    }

    throw new HttpException(StatusCodes.UNAUTHORIZED, "Authentication failed");
  }
};

module.exports = { AuthMiddleware };
