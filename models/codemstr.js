'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CodeMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CodeMstr.hasMany(models.PiddDet, {
        as: 'PiddDet',
        foreignKey: {
          name: 'pidd_payment_type',
          keyType: DataTypes.INTEGER
        }
      })

      CodeMstr.hasMany(models.PtMstr, {
        as: "category",
        foreignKey: {
          name: "pt_group"
        }
      })

      CodeMstr.hasMany(models.PtnrMstr, {
        as: 'ptnr_gender',
        foreignKey: 'ptnr_sex'
      })

      CodeMstr.hasMany(models.PtnrMstr, {
        as: 'ptnr_transaction',
        foreignKey: 'ptnr_transaction_code_id'
      })

      CodeMstr.hasMany(models.PtnrMstr, {
        as: 'ptnr_blood_group',
        foreignKey: 'ptnr_goldarah'
      })

      CodeMstr.hasMany(models.PtnrMstr, {
        as: 'ptnr_nation',
        foreignKey: 'ptnr_negara'
      })

      CodeMstr.hasMany(models.PtnrMstr, {
        as: 'ptnr_sales_type',
        foreignKey: 'ptnr_bp_type'
      })

      CodeMstr.hasMany(models.PtMstr, {
        as: 'color',
        sourceKey: 'code_id',
        foreignKey: 'pt_code_color_id'
      })
    }
  }
  CodeMstr.init({
    code_usr_5: DataTypes.STRING,
    code_usr_4: DataTypes.STRING,
    code_usr_3: DataTypes.STRING,
    code_usr_2: DataTypes.STRING,
    code_usr_1: DataTypes.STRING,
    code_upd_date: DataTypes.DATE,
    code_upd_by: DataTypes.STRING,
    code_seq: DataTypes.INTEGER,
    code_parent: DataTypes.INTEGER,
    code_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    code_name: DataTypes.STRING,
    code_id: DataTypes.INTEGER,
    code_field: DataTypes.STRING,
    code_en_id: DataTypes.INTEGER,
    code_dt: DataTypes.DATE,
    code_dom_id: DataTypes.INTEGER,
    code_desc: DataTypes.STRING,
    code_default: DataTypes.STRING,
    code_code: DataTypes.STRING,
    code_add_date: DataTypes.DATE,
    code_add_by: DataTypes.STRING,
    code_active: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CodeMstr',
    tableName: 'code_mstr',
    schema: 'public',
    timestamps: false
  });
  return CodeMstr;
};