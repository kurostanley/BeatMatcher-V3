'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        user_email: 'user1@example.com',
        user_password: 'password1',
        user_full_name: 'User One',
        user_age: 25,
        user_avatar: 'avatar1.png',
        user_music_clip: 'clip1.mp3',
        user_position: 'Developer',
        user_uid: 'uid1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_email: 'user2@example.com',
        user_password: 'password2',
        user_full_name: 'User Two',
        user_age: 30,
        user_avatar: 'avatar2.png',
        user_music_clip: 'clip2.mp3',
        user_position: 'Designer',
        user_uid: 'uid2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_email: 'user3@example.com',
        user_password: 'password3',
        user_full_name: 'User Three',
        user_age: 28,
        user_avatar: 'avatar3.png',
        user_music_clip: 'clip3.mp3',
        user_position: 'Manager',
        user_uid: 'uid3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
