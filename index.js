require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize, testConnection } = require('./config/database'); // Import sequelize and testConnection
const PORT = process.env.PORT || 8080;
const path = require("path");
const app = express();
const setupWebSocket = require('./socket'); // Import the WebSocket handler


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, "public")));


// WebSocket setup
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });


// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const matchRequestsRoutes = require("./routes/requests");
const messagesRoutes = require("./routes/messages");

// Use routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/requests', matchRequestsRoutes);
app.use('/messages', messagesRoutes);

// Test database connection
testConnection();

// Set up WebSocket
setupWebSocket(io); // Call the WebSocket setup function


// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
