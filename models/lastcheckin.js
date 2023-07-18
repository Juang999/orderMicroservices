'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LastCheckIn extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LastCheckIn.belongsTo(models.PtnrMstr, {
        as: 'last_check_in',
        targetKey: 'ptnr_id',
        foreignKey: 'check_ptnr_id'
      })
    }
  }
  LastCheckIn.init({
    checkin_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    check_upd_date: DataTypes.DATE,
    check_upd_by: DataTypes.STRING,
    check_ptnr_id: DataTypes.INTEGER,
    check_check_out_longtitude: DataTypes.INTEGER,
    check_check_out_latitude: DataTypes.INTEGER,
    check_check_out_date: DataTypes.DATE,
    check_check_in_longitude: DataTypes.INTEGER,
    check_check_in_latitude: DataTypes.INTEGER,
    check_check_in_date: DataTypes.DATE,
    check_add_date: DataTypes.DATE,
    check_add_by: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    modelName: 'LastCheckIn',
    tableName: 'last_check_in',
    timestamps: false
  });
  return LastCheckIn;
};