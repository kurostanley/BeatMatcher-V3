const authRoutes = require("./auth");
const userRoutes = require("./users");
const matchRequestsRoutes = require("./requests");
const messages = require("./messages");

module.exports = function ({ app, dbConn, upload, constants, uploadFile, getFileStream, unlinkFile }) {
  authRoutes({ app, dbConn });
  userRoutes({ app, dbConn, upload, constants, uploadFile, getFileStream, unlinkFile });
  matchRequestsRoutes({ app, dbConn, upload, constants, uploadFile, getFileStream });
  messages({ app, dbConn, upload, constants, uploadFile, getFileStream });
};
