'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PtnraAddr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PtnraAddr.belongsTo(models.PtnrMstr, {
        as: "partner",
        foreignKey: {
          name: "ptnra_ptnr_oid"
        },
        targetKey: "ptnr_oid"
      })

      PtnraAddr.hasMany(models.PtnracCntc, {
        as: "contact_person",
        foreignKey: 'addrc_ptnra_oid'
      })
    }
  }
  PtnraAddr.init({
    ptnra_oid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    ptnra_id: DataTypes.INTEGER,
    ptnra_dom_id: DataTypes.INTEGER,
    ptnra_en_id: DataTypes.INTEGER,
    ptnra_add_by: DataTypes.STRING,
    ptnra_add_date: DataTypes.DATE,
    ptnra_upd_by: DataTypes.STRING,
    ptnra_upd_date: DataTypes.DATE,
    ptnra_line: DataTypes.INTEGER,
    ptnra_line_1: DataTypes.STRING,
    ptnra_line_2: DataTypes.STRING,
    ptnra_line_3: DataTypes.STRING,
    ptnra_phone_1: DataTypes.STRING,
    ptnra_phone_2: DataTypes.STRING,
    ptnra_fax_1: DataTypes.STRING,
    ptnra_fax_2: DataTypes.STRING,
    ptnra_zip: DataTypes.STRING,
    ptnra_ptnr_oid: DataTypes.UUID,
    ptnra_addr_type: DataTypes.INTEGER,
    ptnra_comment: DataTypes.STRING,
    ptnra_active: DataTypes.STRING,
    ptnra_dt: DataTypes.DATE
  }, {
    sequelize,
    schema: 'public',
    modelName: 'PtnraAddr',
    tableName: 'ptnra_addr',
    timestamps: false
  });
  return PtnraAddr;
};