'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ArsoSos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      arso_oid: {
        type: Sequelize.UUID
      },
      arso_ar_oid: {
        type: Sequelize.UUID
      },
      arso_seq: {
        type: Sequelize.INTEGER
      },
      arso_so_oid: {
        type: Sequelize.UUID
      },
      arso_so_code: {
        type: Sequelize.STRING
      },
      arso_so_date: {
        type: Sequelize.DATE
      },
      arso_dt: {
        type: Sequelize.DATE
      },
      arso_amount: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ArsoSos');
  }
};