'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SoshipdDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SoshipdDet.belongsTo(models.SodDet, {
        as: 'detail_sales_order',
        targetKey: 'sod_oid',
        foreignKey: 'soshipd_sod_oid'
      })

      SoshipdDet.belongsTo(models.LocMstr, {
        as: 'warehouse_shippment',
        targetKey: 'loc_id',
        foreignKey: 'soshipd_loc_id'
      })

      SoshipdDet.belongsTo(models.SoShipMstr, {
        as: 'header_shipment',
        targetKey: 'soship_oid',
        foreignKey: 'soshipd_soship_oid'
      })
    }
  }
  SoshipdDet.init({
    soshipd_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    soshipd_soship_oid: DataTypes.UUID,
    soshipd_sod_oid: DataTypes.UUID,
    soshipd_seq: DataTypes.INTEGER,
    soshipd_qty: DataTypes.INTEGER,
    soshipd_um: DataTypes.INTEGER,
    soshipd_um_conv: DataTypes.INTEGER,
    soshipd_cancel_bo: DataTypes.STRING,
    soshipd_qty_real: DataTypes.INTEGER,
    soshipd_si_id: DataTypes.INTEGER,
    soshipd_loc_id: DataTypes.INTEGER,
    soshipd_lot_serial: DataTypes.STRING,
    soshipd_rea_code_id: DataTypes.INTEGER,
    soshipd_dt: DataTypes.DATE,
    soshipd_qty_inv: DataTypes.INTEGER,
    soshipd_close_line: DataTypes.STRING,
    soshipd_qty_allocated: DataTypes.INTEGER,
    soshipd_qty_booked: DataTypes.INTEGER,
    soshipd_sqd_oid: DataTypes.UUID,
    soshipd_part: DataTypes.STRING,
    soshipd_qty_cheked: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    modelName: 'SoshipdDet',
    tableName: 'soshipd_det',
    timestamps: false
  });
  return SoshipdDet;
};