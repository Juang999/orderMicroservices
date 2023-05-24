'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PtsCatCat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PtsCatCat.hasMany(models.PtMstr, {
        as: 'sub_category',
        sourceKey: 'ptscat_id',
        foreignKey: 'pt_ptscat_id'
      })
    }
  }
  PtsCatCat.init({
    ptscat_oid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    ptscat_code: {
      type: DataTypes.STRING,
      unique: true
    },
    ptscat_id: {
      type: DataTypes.INTEGER,
      unique: true
    },
    ptscat_ptcat_id: DataTypes.INTEGER,
    ptscat_desc: DataTypes.STRING,
    ptscat_add_by: DataTypes.STRING,
    ptscat_add_date: DataTypes.DATE,
    ptscat_upd_by: DataTypes.STRING,
    ptscat_upd_date: DataTypes.DATE,
    ptscat_active: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    modelName: 'PtsCatCat',
    tableName: 'ptscat_cat',
    timestamps: false
  });
  return PtsCatCat;
};