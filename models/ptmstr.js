'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PtMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PtMstr.belongsTo(models.EnMstr, {
        as: "EnMstr",
        foreignKey: 'pt_en_id',
        targetKey: "en_id",
      })

      PtMstr.hasMany(models.InvcMstr, {
        as: "Qty",
        foreignKeyConstraint: true,
        foreignKey: 'invc_pt_id',
        sourceKey: 'pt_id',
      })

      PtMstr.belongsTo(models.CodeMstr, {
        as: "category",
        foreignKey: {
          name: "pt_group"
        },
        targetKey: "code_id"
      })

      PtMstr.belongsTo(models.PtCatMstr, {
        as: 'category_product',
        targetKey: 'ptcat_id',
        foreignKey: 'pt_cat_id'
      })
    }
  }
  PtMstr.init({
    pt_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    pt_dom_id: DataTypes.INTEGER,
    pt_en_id: {
      type: DataTypes.INTEGER,
    },
    pt_add_by: DataTypes.STRING,
    pt_add_date: DataTypes.DATE,
    pt_upd_by: DataTypes.STRING,
    pt_upd_date: DataTypes.DATE,
    pt_id: {
      type: DataTypes.INTEGER,
      unique: true
    },
    pt_code: DataTypes.STRING,
    pt_desc1: DataTypes.STRING,
    pt_desc2: DataTypes.STRING,
    pt_pl_id: DataTypes.INTEGER,
    pt_um: DataTypes.INTEGER,
    pt_its_id: DataTypes.INTEGER,
    pt_type: DataTypes.STRING,
    pt_cost_method: DataTypes.STRING,
    pt_loc_type: DataTypes.INTEGER,
    pt_po_is: DataTypes.INTEGER,
    pt_group: DataTypes.INTEGER,
    pt_taxable: DataTypes.STRING,
    pt_pm_code: DataTypes.STRING,
    pt_ls: DataTypes.STRING,
    pt_sfty_stk: DataTypes.INTEGER,
    pt_rop: DataTypes.INTEGER,
    pt_ord_min: DataTypes.INTEGER,
    pt_ord_max: DataTypes.INTEGER,
    pt_cost: DataTypes.INTEGER,
    pt_price: DataTypes.INTEGER,
    pt_dt: DataTypes.DATE,
    pt_loc_id: DataTypes.INTEGER,
    pt_syslog_code: DataTypes.STRING,
    pt_class: DataTypes.STRING,
    pt_writer_id: DataTypes.INTEGER,
    pt_eng_id: DataTypes.INTEGER,
    pt_ppn_type: DataTypes.STRING,
    pt_tax_class: DataTypes.INTEGER,
    pt_si_id: DataTypes.INTEGER,
    pt_tax_inc: DataTypes.STRING,
    pt_approval_status: DataTypes.STRING,
    pt_isbn: DataTypes.STRING,
    pt_phantom: DataTypes.STRING,
    pt_ro_id: DataTypes.INTEGER,
    pt_gambar: DataTypes.STRING,
    pt_qty: DataTypes.INTEGER,
    pt_additional: DataTypes.INTEGER,
    pt_year: DataTypes.DATE,
    pt_clothes_id: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    modelName: 'PtMstr',
    tableName: 'pt_mstr',
    timestamps: false
  });
  return PtMstr;
};