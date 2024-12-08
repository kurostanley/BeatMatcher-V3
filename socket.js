const users = [];

const addUser = (userId, socketId) => {
  !users.some(user => user.userId === userId) && 
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const setupWebSocket = (io) => {
  io.on('connection', (socket) => {
    console.log("A user connected.");

    // Add user to the connected users list
    socket.on('addUser', (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    // Send and receive messages
    socket.on("sendMessage", ({ senderId, senderName, receiverId, text, receiverAvatar }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("getMessage", {
          senderId,
          senderName,
          receiverId,
          text,
          receiverAvatar
        });
        console.log("Message sent");
      }
    });

    // Handle match notifications
    socket.on("match", ({ senderId, senderName, senderAvatar, receiverId, receiverName }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("getMatch", {
          senderId,
          senderName,
          senderAvatar,
          receiverId,
          receiverName
        });
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
};

module.exports = setupWebSocket;