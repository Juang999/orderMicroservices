'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VisitedDets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      visited_oid: {
        type: Sequelize.UUID
      },
      visited_visit_code: {
        type: Sequelize.STRING
      },
      visited_type: {
        type: Sequelize.STRING
      },
      visited_ptnr_id: {
        type: Sequelize.INTEGER
      },
      visited_cus_name: {
        type: Sequelize.STRING
      },
      visited_cus_address: {
        type: Sequelize.STRING
      },
      visited_cus_phone: {
        type: Sequelize.STRING
      },
      visited_lat_gps_check_in: {
        type: Sequelize.INTEGER
      },
      visited_long_gps_check_in: {
        type: Sequelize.INTEGER
      },
      visited_address_gps_check_in: {
        type: Sequelize.STRING
      },
      visited_result: {
        type: Sequelize.STRING
      },
      visited_status: {
        type: Sequelize.STRING
      },
      visited_upd_date: {
        type: Sequelize.DATE
      },
      visited_upd_by: {
        type: Sequelize.STRING
      },
      visited_add_date: {
        type: Sequelize.DATE
      },
      visited_add_by: {
        type: Sequelize.STRING
      },
      visited_date: {
        type: Sequelize.DATE
      },
      visited_foto: {
        type: Sequelize.STRING
      },
      visited_check_in: {
        type: Sequelize.DATE
      },
      visited_check_out: {
        type: Sequelize.DATE
      },
      visited_lat_gps_check_out: {
        type: Sequelize.INTEGER
      },
      visited_long_gps_check_out: {
        type: Sequelize.INTEGER
      },
      visited_address_gps_check_out: {
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
    await queryInterface.dropTable('VisitedDets');
  }
};