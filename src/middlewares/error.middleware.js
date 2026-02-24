const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const errorMiddleware = (error, req, res, next) => {
  const errMsg = error.msg || error.message || ReasonPhrases.GATEWAY_TIMEOUT;
  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({ success: false, message: errMsg });
};

module.exports = { errorMiddleware };
