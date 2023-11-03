'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PsdDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PsdDet.belongsTo(models.PsMstr, {
        as: 'header_package',
        targetKey: 'ps_oid',
        foreignKey: 'psd_ps_oid'
      })

      PsdDet.belongsTo(models.PtMstr, {
        as: 'detail_product',
        targetKey: 'pt_id',
        foreignKey: 'psd_pt_bom_id'
      })
    }
  }
  PsdDet.init({
    psd_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    psd_ps_oid: DataTypes.UUID,
    psd_add_by: DataTypes.STRING,
    psd_add_date: DataTypes.DATE,
    psd_upd_by: DataTypes.STRING,
    psd_upd_date: DataTypes.DATE,
    psd_use_bom: DataTypes.STRING,
    psd_pt_bom_id: DataTypes.INTEGER,
    psd_comp: DataTypes.STRING,
    psd_ref: DataTypes.STRING,
    psd_desc: DataTypes.STRING,
    psd_start_date: DataTypes.DATE,
    psd_end_date: DataTypes.DATE,
    psd_qty: DataTypes.INTEGER,
    psd_str_type: DataTypes.STRING,
    psd_scrp_pct: DataTypes.INTEGER,
    psd_lt_off: DataTypes.INTEGER,
    psd_op: DataTypes.INTEGER,
    psd_seq: DataTypes.INTEGER,
    psd_fcst_pct: DataTypes.INTEGER,
    psd_group: DataTypes.INTEGER,
    psd_process: DataTypes.INTEGER,
    psd_dt: DataTypes.DATE,
    psd_qty_plan: DataTypes.INTEGER,
    psd_qty_variance: DataTypes.INTEGER,
    psd_indirect: DataTypes.STRING,
    psd_yield_pct: DataTypes.INTEGER,
    psd_insheet_pct: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    tableName: 'psd_det',
    modelName: 'PsdDet',
    timestamps: false
  });
  return PsdDet;
};