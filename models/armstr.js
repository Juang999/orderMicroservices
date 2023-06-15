'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ArMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ArMstr.belongsTo(models.SoMstr, {
        as: 'sales_order',
        foreignKey: 'ar_remarks',
        targetKey: 'so_code'
      })
    }
  }
  ArMstr.init({
    ar_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    ar_dom_id: DataTypes.INTEGER,
    ar_en_id: DataTypes.INTEGER,
    ar_add_by: DataTypes.STRING,
    ar_add_date: DataTypes.DATE,
    ar_upd_by: DataTypes.STRING,
    ar_upd_date: DataTypes.DATE,
    ar_code: DataTypes.STRING,
    ar_bill_to: DataTypes.INTEGER,
    ar_cu_id: DataTypes.INTEGER,
    ar_date: DataTypes.DATE,
    ar_eff_date: DataTypes.DATE,
    ar_amount: DataTypes.INTEGER,
    ar_pay_amount: DataTypes.INTEGER,
    ar_disc_date: DataTypes.DATE,
    ar_due_date: DataTypes.DATE,
    ar_expt_date: DataTypes.DATE,
    ar_exc_rate: DataTypes.INTEGER,
    ar_taxable: DataTypes.INTEGER,
    ar_tax_class_id: DataTypes.INTEGER,
    ar_ac_id: DataTypes.INTEGER,
    ar_sb_id: DataTypes.INTEGER,
    ar_cc_id: DataTypes.INTEGER,
    ar_remarks: DataTypes.STRING,
    ar_status: DataTypes.STRING,
    ar_dt: DataTypes.DATE,
    ar_type: DataTypes.INTEGER,
    ar_credit_term: DataTypes.INTEGER,
    ar_pay_prepaid: DataTypes.INTEGER,
    ar_ac_prepaid: DataTypes.INTEGER,
    ar_bk_id: DataTypes.INTEGER,
    ar_terbilang: DataTypes.STRING,
    ar_tax_inc: DataTypes.STRING,
    ar_ppn_type: DataTypes.STRING,
    ar_ti_in_use: DataTypes.STRING,
    ar_shipping_charges: DataTypes.INTEGER,
    ar_total_final: DataTypes.INTEGER,
    ar_point: DataTypes.INTEGER,
    ar_close_date: DataTypes.DATE
  }, {
    sequelize,
    schema: 'public',
    modelName: 'ArMstr',
    tableName: 'ar_mstr',
    timestamps: false
  });
  return ArMstr;
};