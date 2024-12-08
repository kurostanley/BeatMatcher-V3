const authRoutes = require("./auth");
const userRoutes = require("./users");
const matchRequestsRoutes = require("./requests");
const messagesRoutes = require("./messages");

module.exports = function ({ app, constants }) {
  if (!constants) {
    throw new Error("Constants are not defined");
  }

  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);
  app.use('/requests', matchRequestsRoutes);
  app.use('/messages', messagesRoutes);
};
