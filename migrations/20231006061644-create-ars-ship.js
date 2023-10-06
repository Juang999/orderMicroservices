'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ArsShips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ars_oid: {
        type: Sequelize.UUID
      },
      ars_ar_oid: {
        type: Sequelize.UUID
      },
      ars_seq: {
        type: Sequelize.INTEGER
      },
      ars_soshipd_oid: {
        type: Sequelize.UUID
      },
      ars_taxable: {
        type: Sequelize.STRING
      },
      ars_tax_class_id: {
        type: Sequelize.INTEGER
      },
      ars_tax_inc: {
        type: Sequelize.STRING
      },
      ars_open: {
        type: Sequelize.INTEGER
      },
      ars_invoice: {
        type: Sequelize.INTEGER
      },
      ars_so_price: {
        type: Sequelize.INTEGER
      },
      ars_gl_price: {
        type: Sequelize.INTEGER
      },
      ars_invoice_price: {
        type: Sequelize.INTEGER
      },
      ars_close_line: {
        type: Sequelize.INTEGER
      },
      ars_dt: {
        type: Sequelize.DATE
      },
      ars_fp_status: {
        type: Sequelize.STRING
      },
      ars_so_disc_value: {
        type: Sequelize.INTEGER
      },
      ars_shipment: {
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
    await queryInterface.dropTable('ArsShips');
  }
};