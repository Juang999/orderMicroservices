'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PtCatMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      PtCatMstr.hasMany(models.PtMstr, {
        as: 'category_product',
        foreignKey: 'pt_cat_id'
      })
    }
  }
  PtCatMstr.init({
    ptcat_oid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    ptcat_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    ptcat_group_id: DataTypes.INTEGER,
    ptcat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    ptcat_desc: DataTypes.STRING,
    ptcat_active: DataTypes.STRING,
    ptcat_add_by: DataTypes.STRING,
    ptcat_add_date: DataTypes.DATE,
    ptcat_upd_by: DataTypes.STRING,
    ptcat_upd_date: DataTypes.DATE
  }, {
    sequelize,
    schema: 'public',
    modelName: 'PtCatMstr',
    tableName: 'ptcat_mstr',
    timestamps: false
  });
  return PtCatMstr;
};