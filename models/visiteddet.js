'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VisitedDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      VisitedDet.belongsTo(models.VisitMstr, {
        as: "visited_master",
        targetKey: "visit_code",
        foreignKey: "visited_visit_code"
      })

      VisitedDet.belongsTo(models.PtnrMstr, {
        as: "visited_partner",
        targetKey: "ptnr_id",
        foreignKey: "visited_ptnr_id"
      })
    }
  }
  VisitedDet.init({
    visited_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    visited_visit_code: DataTypes.STRING,
    visited_type: DataTypes.STRING,
    visited_ptnr_id: DataTypes.INTEGER,
    visited_cus_name: DataTypes.STRING,
    visited_cus_address: DataTypes.STRING,
    visited_cus_phone: DataTypes.STRING,
    visited_lat_gps_check_in: DataTypes.INTEGER,
    visited_long_gps_check_in: DataTypes.INTEGER,
    visited_address_gps_check_in: DataTypes.STRING,
    visited_result: DataTypes.STRING,
    visited_status: DataTypes.STRING,
    visited_upd_date: DataTypes.DATE,
    visited_upd_by: DataTypes.STRING,
    visited_add_date: DataTypes.DATE,
    visited_add_by: DataTypes.STRING,
    visited_date: DataTypes.DATE,
    visited_foto: DataTypes.STRING,
    visited_check_in: DataTypes.DATE,
    visited_check_out: DataTypes.DATE,
    visited_lat_gps_check_out: DataTypes.INTEGER,
    visited_long_gps_check_out: DataTypes.INTEGER,
    visited_address_gps_check_out: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    modelName: 'VisitedDet',
    tableName: 'visited_det',
    timestamps: false
  });
  return VisitedDet;
};