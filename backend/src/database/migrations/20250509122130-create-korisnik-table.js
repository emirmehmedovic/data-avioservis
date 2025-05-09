'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('korisnik', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'manager', 'user'),
        allowNull: false,
        defaultValue: 'user'
      },
      ime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      prezime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      telefon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      zadnja_prijava: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('korisnik');
  }
};
