const authRoutes = require("./auth");
const userRoutes = require("./users");
const matchRequestsRoutes = require("./requests");
const messages = require("./messages");

module.exports = function ({ app, dbConn, upload, constants, uploadFile, getFileStream, unlinkFile, bcrypt, jwt}) {
  authRoutes({ app, dbConn, bcrypt, jwt });
  userRoutes({ app, dbConn, upload, constants, uploadFile, getFileStream, unlinkFile, bcrypt});
  matchRequestsRoutes({ app, dbConn, upload, constants, uploadFile, getFileStream });
  messages({ app, dbConn, upload, constants, uploadFile, getFileStream });
};
