require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const mysql = require("mysql");
const path = require("path");
const PORT = process.env.PORT || 8080;
const app = express();




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors:{ origin: '*' }});




app.use(express.static(path.join(__dirname, "public")));

// create constants for the application.
const constants = {
  matchRequestStatus: {
    pending: 0,
    accepted: 1,
    rejected: -1,
  },
};

// config multers.
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/img");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${file.fieldname}-${Date.now()}.jpg`);
//   },
// });

// const upload = multer({ storage: storage });

// config multers for music.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.mp3`);
  },
});

const upload = multer({ storage: storage });


// create datbase connection
const dbConn = mysql.createConnection({
  host: process.env.DB_HOST || "",
  user: process.env.DB_USER_NAME || "",
  password: process.env.DB_USER_PASSWORD || "",
  database: process.env.DB_NAME || "",
  port: process.env.DB_PORT || "",
});

var users =[];

const addUser = (userId, socketId) => {
  !users.some(user => user.userId === userId) && 
    users.push({userId, socketId})
}

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.sockets.on('connection', function (socket) {
  console.log("a user connected.")
   
  // take userId and sock.id from user
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  })

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text, senderAvatar }) => {
    const user = getUser(receiverId);
    if(user){
      io.to(user.socketId).emit("getMessage", {
        senderId,
        receiverId,
        text,
        senderAvatar
      });
      console.log("message send")
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
})

server.listen(3000, () => {
  console.log(`Socket.io server listening on port 3000`);
});


dbConn.connect(function (err) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log("Database was connected");
  require("./routes")({ app, dbConn, upload, constants })
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
