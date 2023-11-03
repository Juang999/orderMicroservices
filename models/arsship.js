'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ArsShip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ArsShip.init({
    ars_oid: DataTypes.UUID,
    ars_ar_oid: DataTypes.UUID,
    ars_seq: DataTypes.INTEGER,
    ars_soshipd_oid: DataTypes.UUID,
    ars_taxable: DataTypes.STRING,
    ars_tax_class_id: DataTypes.INTEGER,
    ars_tax_inc: DataTypes.STRING,
    ars_open: DataTypes.INTEGER,
    ars_invoice: DataTypes.INTEGER,
    ars_so_price: DataTypes.INTEGER,
    ars_gl_price: DataTypes.INTEGER,
    ars_invoice_price: DataTypes.INTEGER,
    ars_close_line: DataTypes.INTEGER,
    ars_dt: DataTypes.DATE,
    ars_fp_status: DataTypes.STRING,
    ars_so_disc_value: DataTypes.INTEGER,
    ars_shipment: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ArsShip',
  });
  return ArsShip;
};