'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_avatar: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_music_clip: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_position: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_uid: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
