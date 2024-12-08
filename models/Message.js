const { Sequelize, DataTypes } = require('sequelize');
const { sequelize }  = require('../config/database'); // Adjust the path as necessary

const Message = sequelize.define('Message', {
  sender_uid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  recipient_uid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Export the model
module.exports = Message;