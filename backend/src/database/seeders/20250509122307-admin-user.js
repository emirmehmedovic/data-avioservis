'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Generate a hashed password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('admin123', salt);
    
    // Insert admin user
    await queryInterface.bulkInsert('korisnik', [{
      username: 'admin',
      email: 'admin@admin.com',
      password_hash: password_hash,
      role: 'admin',
      status: true,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    // Remove the admin user
    await queryInterface.bulkDelete('korisnik', { 
      email: 'admin@admin.com' 
    }, {});
  }
};
