'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SizeMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      size_oid: {
        type: Sequelize.UUID
      },
      size_id: {
        type: Sequelize.INTEGER
      },
      size_add_by: {
        type: Sequelize.STRING
      },
      size_add_date: {
        type: Sequelize.DATE
      },
      size_code: {
        type: Sequelize.STRING
      },
      size_name: {
        type: Sequelize.STRING
      },
      size_desc: {
        type: Sequelize.STRING
      },
      size_active: {
        type: Sequelize.STRING
      },
      size_upd_by: {
        type: Sequelize.STRING
      },
      size_upd_date: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('SizeMstrs');
  }
};