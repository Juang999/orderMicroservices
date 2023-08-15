'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SizeMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SizeMstr.hasMany(models.PtMstr, {
        as: 'size',
        sourceKey: 'size_id',
        foreignKey: 'pt_size_code_id'
      })
    }
  }
  SizeMstr.init({
    size_oid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    size_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false
    },
    size_add_by: DataTypes.STRING,
    size_add_date: DataTypes.DATE,
    size_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    size_name: DataTypes.STRING,
    size_desc: DataTypes.STRING,
    size_active: DataTypes.STRING,
    size_upd_by: DataTypes.STRING,
    size_upd_date: DataTypes.DATE
  }, {
    sequelize,
    schema: 'public',
    modelName: 'SizeMstr',
    tableName: 'size_mstr',
    timestamps: false
  });
  return SizeMstr;
};