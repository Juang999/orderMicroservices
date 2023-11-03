'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WhMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      wh_oid: {
        type: Sequelize.UUID
      },
      wh_dom_id: {
        type: Sequelize.INTEGER
      },
      wh_en_id: {
        type: Sequelize.INTEGER
      },
      wh_id: {
        type: Sequelize.INTEGER
      },
      wh_add_by: {
        type: Sequelize.STRING
      },
      wh_add_date: {
        type: Sequelize.DATE
      },
      wh_upd_by: {
        type: Sequelize.STRING
      },
      wh_upd_date: {
        type: Sequelize.DATE
      },
      wh_seq: {
        type: Sequelize.INTEGER
      },
      wh_parent: {
        type: Sequelize.INTEGER
      },
      wh_code: {
        type: Sequelize.STRING
      },
      wh_desc: {
        type: Sequelize.STRING
      },
      wh_type: {
        type: Sequelize.INTEGER
      },
      wh_cat: {
        type: Sequelize.INTEGER
      },
      wh_active: {
        type: Sequelize.STRING
      },
      wh_dt: {
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
    await queryInterface.dropTable('WhMstrs');
  }
};