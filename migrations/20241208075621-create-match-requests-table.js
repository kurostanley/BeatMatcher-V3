'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('MatchRequests', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      match_request_from: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      match_request_to: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      match_request_sender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      match_request_receiver: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      match_request_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0, // Assuming 0 is for pending
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
    await queryInterface.dropTable('MatchRequests');
  }
};
