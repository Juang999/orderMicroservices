'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PidDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PidDet.init({
    pid_oid: DataTypes.UUID,
    pid_add_by: DataTypes.STRING,
    pid_add_date: DataTypes.DATE,
    pid_upd_date: DataTypes.DATE,
    pid_upd_by: DataTypes.STRING,
    pid_pi_oid: DataTypes.UUID,
    pid_pt_id: DataTypes.INTEGER,
    pid_dt: DataTypes.DATE,
    pid_pt_tax_class: DataTypes.INTEGER,
    pid_pt_ppn_type: DataTypes.STRING,
    pid_pt_taxable: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    modelName: 'PidDet',
    tableName: 'pid_det',
    timestamps: false
  });
  return PidDet;
};