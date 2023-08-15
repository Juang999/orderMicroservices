'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SqMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SqMstr.hasOne(models.SoMstr, {
        as: 'sales_order',
        foreignKey: 'so_ref_sq_oid',
        sourceKey: 'sq_oid'
      })

      SqMstr.belongsTo(models.PtnrMstr, {
        as: 'sold_to',
        foreignKey: 'sq_ptnr_id_sold',
        targetKey: 'ptnr_id'
      })
    }
  }
  SqMstr.init({
    sq_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    sq_dom_id: DataTypes.INTEGER,
    sq_en_id: DataTypes.INTEGER,
    sq_add_by: DataTypes.STRING,
    sq_add_date: DataTypes.DATE,
    sq_upd_by: DataTypes.STRING,
    sq_upd_date: DataTypes.DATE,
    sq_code: DataTypes.STRING,
    sq_ptnr_id_sold: DataTypes.INTEGER,
    sq_ptnr_id_bill: DataTypes.INTEGER,
    sq_date: DataTypes.DATE,
    sq_credit_term: DataTypes.INTEGER,
    sq_taxable: DataTypes.STRING,
    sq_tax_class: DataTypes.STRING,
    sq_si_id: DataTypes.INTEGER,
    sq_type: DataTypes.STRING,
    sq_sales_person: DataTypes.INTEGER,
    sq_pi_id: DataTypes.INTEGER,
    sq_pay_type: DataTypes.INTEGER,
    sq_pay_method: DataTypes.INTEGER,
    sq_dp: DataTypes.INTEGER,
    sq_disc_header: DataTypes.INTEGER,
    sq_total: DataTypes.INTEGER,
    sq_print_count: DataTypes.INTEGER,
    sq_due_date: DataTypes.DATE,
    sq_close_date: DataTypes.DATE,
    sq_tran_id: DataTypes.INTEGER,
    sq_trans_id: DataTypes.STRING,
    sq_trans_rmks: DataTypes.STRING,
    sq_current_route: DataTypes.STRING,
    sq_next_route: DataTypes.STRING,
    sq_dt: DataTypes.DATE,
    sq_bk_appr: DataTypes.STRING,
    sq_cu_id: DataTypes.INTEGER,
    sq_total_ppn: DataTypes.INTEGER,
    sq_total_pph: DataTypes.INTEGER,
    sq_payment: DataTypes.INTEGER,
    sq_exc_rate: DataTypes.INTEGER,
    sq_tax_inc: DataTypes.STRING,
    sq_cons: DataTypes.STRING,
    sq_terbilang: DataTypes.STRING,
    sq_bk_id: DataTypes.INTEGER,
    sq_interval: DataTypes.INTEGER,
    sq_ref_po_code: DataTypes.STRING,
    sq_ref_po_oid: DataTypes.UUID,
    sq_ppn_type: DataTypes.STRING,
    sq_ac_prepaid: DataTypes.INTEGER,
    sq_pay_prepaod: DataTypes.INTEGER,
    sq_ar_ac_id: DataTypes.INTEGER,
    sq_ar_sb_id: DataTypes.INTEGER,
    sq_ar_cc_id: DataTypes.INTEGER,
    sq_need_date: DataTypes.DATE,
    sq_payment_date: DataTypes.DATE,
    sq_last_transaction: DataTypes.DATE,
    sq_is_package: DataTypes.STRING,
    sq_pt_id: DataTypes.INTEGER,
    sq_price: DataTypes.INTEGER,
    sq_sales_program: DataTypes.STRING,
    sq_status_produk: DataTypes.STRING,
    sq_diskon_produk: DataTypes.STRING,
    sq_unique_code: DataTypes.STRING,
    sq_dp_unique: DataTypes.STRING,
    sq_payment_unique: DataTypes.STRING,
    so_cons: DataTypes.STRING,
    sq_booking: DataTypes.STRING,
    sq_book_start_date: DataTypes.DATE,
    sq_book_end_date: DataTypes.DATE,
    sq_alocated: DataTypes.STRING,
    sq_book_status: DataTypes.STRING,
    sq_quo_type: DataTypes.INTEGER,
    sq_project: DataTypes.STRING,
    sq_shipping_charges: DataTypes.INTEGER,
    sq_total_final: DataTypes.INTEGER,
    sq_indent: DataTypes.STRING,
    sq_manufacture: DataTypes.STRING,
    sq_ptsfr_loc_id: DataTypes.INTEGER,
    sq_ptsfr_loc_to_id: DataTypes.INTEGER,
    sq_ptsfr_loc_git: DataTypes.INTEGER,
    sq_en_to_id: DataTypes.INTEGER,
    sq_si_to_id: DataTypes.INTEGER,
    sq_rebooking: DataTypes.STRING,
    sq_sq_ref_oid: DataTypes.UUID,
    sq_sq_ref_code: DataTypes.STRING,
    sq_dropshipper: DataTypes.STRING,
    sq_ship_to: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    modelName: 'SqMstr',
    tableName: 'sq_mstr',
    timestamps: false
  });
  return SqMstr;
};