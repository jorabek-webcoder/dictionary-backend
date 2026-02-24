const { config } = require("dotenv");
config();

const PORT = process.env.PORT;
const REG_KEY = process.env.REG_KEY;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const MONGO_URI = process.env.MONGO_URI || "http://localhost:3000";

module.exports = {
  PORT,
  REG_KEY,
  JWT_SECRET_KEY,
  CORS_ORIGIN,
  MONGO_URI,
};
