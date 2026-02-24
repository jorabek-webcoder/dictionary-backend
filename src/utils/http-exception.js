class HttpException extends Error {
  constructor(statusCode, msg) {
    super(msg);

    this.msg = msg;
    this.statusCode = statusCode;
  }
}

module.exports = { HttpException };
