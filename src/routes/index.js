
const { AuthRouter } = require("./auth/auth.route");
const { DictionaryRouter } = require("./dictionary/dictionary.route");

const mainRouter = [
  { path: "/dictionary", rout: DictionaryRouter },
  { path: "/auth", rout: AuthRouter },
];

module.exports = { mainRouter };
