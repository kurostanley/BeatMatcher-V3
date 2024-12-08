const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Adjust the path as necessary

const User = sequelize.define('User', {
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  user_password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_avatar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_music_clip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_uid: {
    type: DataTypes.STRING,
  },
}, {
    timestamps: true,
  }
);

module.exports = User; 