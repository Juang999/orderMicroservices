'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VisitMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      visit_code: {
        type: Sequelize.STRING
      },
      visit_startdate: {
        type: Sequelize.DATE
      },
      visit_enddate: {
        type: Sequelize.DATE
      },
      visit_en_id: {
        type: Sequelize.INTEGER
      },
      visit_sales_id: {
        type: Sequelize.INTEGER
      },
      visit_add_date: {
        type: Sequelize.DATE
      },
      visit_add_by: {
        type: Sequelize.STRING
      },
      visit_upd_date: {
        type: Sequelize.DATE
      },
      visit_upd_by: {
        type: Sequelize.STRING
      },
      visit_status: {
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
    await queryInterface.dropTable('VisitMstrs');
  }
};