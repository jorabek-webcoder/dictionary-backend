const { connect } = require("mongoose");
const { MONGO_URI } = require("./secret");

const ConnectDB = async () => {
  try {
    await connect(MONGO_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = { ConnectDB };
