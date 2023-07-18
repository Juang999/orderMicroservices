'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LastCheckIns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      checkin_oid: {
        type: Sequelize.UUID
      },
      check_upd_date: {
        type: Sequelize.DATE
      },
      check_upd_by: {
        type: Sequelize.STRING
      },
      check_ptnr_id: {
        type: Sequelize.INTEGER
      },
      check_check_out_longtitude: {
        type: Sequelize.INTEGER
      },
      check_check_out_latitude: {
        type: Sequelize.INTEGER
      },
      check_check_out_date: {
        type: Sequelize.DATE
      },
      check_check_in_longitude: {
        type: Sequelize.INTEGER
      },
      check_check_in_latitude: {
        type: Sequelize.INTEGER
      },
      check_check_in_date: {
        type: Sequelize.DATE
      },
      check_add_date: {
        type: Sequelize.DATE
      },
      check_add_by: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('LastCheckIns');
  }
};