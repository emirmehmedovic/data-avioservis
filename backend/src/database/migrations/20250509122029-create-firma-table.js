'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('firma', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      naziv: {
        type: Sequelize.STRING,
        allowNull: false
      },
      adresa: {
        type: Sequelize.STRING,
        allowNull: true
      },
      grad: {
        type: Sequelize.STRING,
        allowNull: true
      },
      drzava: {
        type: Sequelize.STRING,
        allowNull: true
      },
      telefon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pib: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pdv_broj: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.dropTable('firma');
  }
};
