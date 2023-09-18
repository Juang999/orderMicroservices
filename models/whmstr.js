'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WhMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WhMstr.belongsTo(models.EnMstr, {
        as: 'entity',
        targetKey: 'en_id',
        foreignKey: 'wh_en_id'
      })
    }
  }
  WhMstr.init({
    wh_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    wh_dom_id: DataTypes.INTEGER,
    wh_en_id: DataTypes.INTEGER,
    wh_id: DataTypes.INTEGER,
    wh_add_by: DataTypes.STRING,
    wh_add_date: DataTypes.DATE,
    wh_upd_by: DataTypes.STRING,
    wh_upd_date: DataTypes.DATE,
    wh_seq: DataTypes.INTEGER,
    wh_parent: DataTypes.INTEGER,
    wh_code: DataTypes.STRING,
    wh_desc: DataTypes.STRING,
    wh_type: DataTypes.INTEGER,
    wh_cat: DataTypes.INTEGER,
    wh_active: DataTypes.STRING,
    wh_dt: DataTypes.DATE
  }, {
    sequelize,
    schema: 'public',
    modelName: 'WhMstr',
    tableName: 'wh_mstr',
    timestamps: false
  });
  return WhMstr;
};