'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VisitMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      VisitMstr.hasMany(models.VisitedDet, {
        as: "visit_detail",
        foreignKey: "visited_visit_code"
      })
    }
  }
  VisitMstr.init({
    visit_code: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    visit_startdate: DataTypes.DATE,
    visit_enddate: DataTypes.DATE,
    visit_en_id: DataTypes.INTEGER,
    visit_sales_id: DataTypes.INTEGER,
    visit_add_date: DataTypes.DATE,
    visit_add_by: DataTypes.STRING,
    visit_upd_date: DataTypes.DATE,
    visit_upd_by: DataTypes.STRING,
    visit_status: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    modelName: 'VisitMstr',
    tableName: 'visit_mstr',
    timestamps: false
  });
  return VisitMstr;
};