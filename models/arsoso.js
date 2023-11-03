'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ArsoSo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ArsoSo.belongsTo(models.ArMstr, {
        as: 'relation_debt_data',
        targetKey: 'ar_oid',
        foreignKey: 'arso_ar_oid'
      })

      ArsoSo.belongsTo(models.SoMstr, {
        as: 'relation_to_so',
        targetKey: 'so_oid',
        foreignKey: 'arso_so_oid'
      })
    }
  }
  ArsoSo.init({
    arso_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    arso_ar_oid: DataTypes.UUID,
    arso_seq: DataTypes.INTEGER,
    arso_so_oid: DataTypes.UUID,
    arso_so_code: DataTypes.STRING,
    arso_so_date: DataTypes.DATE,
    arso_dt: DataTypes.DATE,
    arso_amount: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    modelName: 'ArsoSo',
    tableName: 'arso_so',
    timestamps: false
  });
  return ArsoSo;
};