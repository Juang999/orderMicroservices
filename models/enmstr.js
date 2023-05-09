'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EnMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EnMstr.hasMany(models.PtMstr, {
        as: 'PtMstr',
        foreignKey: {
          name: 'pt_en_id',
          keyType: DataTypes.INTEGER
        }
      })

      EnMstr.hasMany(models.PtnrMstr, {
        as: 'ptnr_entity',
        foreignKey: 'ptnr_en_id'
      })

      EnMstr.hasMany(models.PtnraAddr, {
        as: 'ptnra_entity',
        foreignKey: 'ptnra_en_id'
      })
    }
  }
  EnMstr.init({
    en_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    en_dom_id: DataTypes.INTEGER,
    en_add_by: DataTypes.STRING,
    en_add_date: DataTypes.DATE,
    en_upd_by: DataTypes.DATE,
    en_upd_date: DataTypes.STRING,
    en_id: {
      type: DataTypes.INTEGER,
      unique: true
    },
    en_code: DataTypes.STRING,
    en_desc: DataTypes.STRING,
    en_parent: DataTypes.INTEGER,
    en_active: DataTypes.INTEGER,
    en_dt: DataTypes.DATE,
    en_limit_account: DataTypes.STRING,
    en_pi_id: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    modelName: 'EnMstr',
    tableName: 'en_mstr',
    timestamps: false,
  });
  return EnMstr;
};