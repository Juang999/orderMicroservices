'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PiddDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PiddDet.belongsTo(models.CodeMstr, {
        as: "PaymentType",
        foreignKey: "pidd_payment_type",
        targetKey: "code_id"
      })

      PiddDet.belongsTo(models.PidDet, {
        as: 'detail_price',
        targetKey: 'pid_oid',
        foreignKey: 'pidd_pid_oid'
      })
    }
  }
  PiddDet.init({
    pidd_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    pidd_add_by: DataTypes.STRING,
    pidd_add_date: DataTypes.DATE,
    pidd_upd_date: DataTypes.DATE,
    pidd_upd_by: DataTypes.STRING,
    pidd_pid_oid: DataTypes.UUID,
    pidd_payment_type: DataTypes.INTEGER,
    pidd_price: DataTypes.INTEGER,
    pidd_disc: DataTypes.INTEGER,
    pidd_dp: DataTypes.INTEGER,
    pidd_interval: DataTypes.INTEGER,
    pidd_payment: DataTypes.INTEGER,
    pidd_min_qty: DataTypes.INTEGER,
    pidd_sales_unit: DataTypes.INTEGER,
    pidd_dt: DataTypes.DATE,
    pidd_commision: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    modelName: 'PiddDet',
    tableName: 'pidd_det',
    timestamps: false
  });
  return PiddDet;
};