const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Adjust the path as necessary

const MatchRequest = sequelize.define('MatchRequest', {
  match_request_from: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  match_request_to: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  match_request_sender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  match_request_receiver: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  match_request_status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Assuming 0 is for pending
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Export the model
module.exports = MatchRequest;