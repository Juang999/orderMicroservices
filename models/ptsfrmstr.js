'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PtsfrMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PtsfrMstr.init({
    ptsfr_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    ptsfr_dom_id: DataTypes.INTEGER,
    ptsfr_en_id: DataTypes.INTEGER,
    ptsfr_add_by: DataTypes.STRING,
    ptsfr_add_date: DataTypes.DATE,
    ptsfr_upd_by: DataTypes.STRING,
    ptsfr_upd_date: DataTypes.DATE,
    ptsfr_en_to_id: DataTypes.INTEGER,
    ptsfr_code: DataTypes.STRING,
    ptsfr_date: DataTypes.DATE,
    ptsfr_receive_date: DataTypes.DATE,
    ptsfr_si_id: DataTypes.STRING,
    ptsfr_loc_id: DataTypes.STRING,
    ptsfr_loc_git: DataTypes.STRING,
    ptsfr_remarks: DataTypes.STRING,
    ptsfr_trans_id: DataTypes.STRING,
    ptsfr_dt: DataTypes.DATE,
    ptsfr_loc_to_id: DataTypes.INTEGER,
    ptsfr_si_to_id: DataTypes.INTEGER,
    ptsfr_pb_oid: DataTypes.UUID,
    ptsfr_so_oid: DataTypes.UUID,
    pt_tax_class: DataTypes.STRING,
    ptsfr_tran_id: DataTypes.INTEGER,
    ptsfr_sq_oid: DataTypes.UUID,
    ptsfr_is_transfer: DataTypes.STRING,
    ptsfr_auto_receipts: DataTypes.STRING,
    ptsfr_booking: DataTypes.STRING,
    ptsfr_cons: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    modelName: 'PtsfrMstr',
    tableName: 'ptsfr_mstr',
    timestamps: false
  });
  return PtsfrMstr;
};