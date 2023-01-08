const authRoutes = require("./auth");
const userRoutes = require("./users");
const matchRequestsRoutes = require("./requests");
const messages = require("./messages");

module.exports = function ({ app, dbConn, uploadPic, uploadMusic, constants }) {
  authRoutes({ app, dbConn });
  userRoutes({ app, dbConn, uploadPic, uploadMusic, constants });
  matchRequestsRoutes({ app, dbConn, uploadMusic, constants });
  messages({ app, dbConn, uploadPic, uploadMusic, constants });
};
