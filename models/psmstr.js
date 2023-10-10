'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PsMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PsMstr.hasMany(models.PsdDet, {
        as: 'detail_package',
        sourceKey: 'ps_oid',
        foreignKey: 'psd_ps_oid'
      })

      PsMstr.belongsTo(models.EnMstr, {
        as: 'entity_package',
        targetKey: 'en_id',
        foreignKey: 'ps_en_id'
      })
    }
  }
  PsMstr.init({
    ps_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    ps_dom_id: DataTypes.INTEGER,
    ps_en_id: DataTypes.INTEGER,
    ps_add_by: DataTypes.STRING,
    ps_add_date: DataTypes.DATE,
    ps_upd_by: DataTypes.STRING,
    ps_upd_date: DataTypes.DATE,
    ps_id: DataTypes.INTEGER,
    ps_par: DataTypes.STRING,
    ps_desc: DataTypes.STRING,
    ps_use_bom: DataTypes.STRING,
    ps_pt_bom_id: DataTypes.INTEGER,
    ps_active: DataTypes.STRING,
    ps_dt: DataTypes.DATE,
    ps_rev: DataTypes.INTEGER,
    ps_remarks: DataTypes.STRING,
    ps_tran_id: DataTypes.INTEGER,
    ps_trans_id: DataTypes.STRING,
    ps_ratio: DataTypes.INTEGER,
    ps_is_assembly: DataTypes.STRING,
    ps_pi_id: DataTypes.INTEGER,
    ps_pi_oid: DataTypes.UUID
  }, {
    sequelize,
    schema: 'public',
    tableName: 'ps_mstr',
    modelName: 'PsMstr',
    timestamps: false
  });
  return PsMstr;
};