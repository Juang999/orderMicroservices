'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PiMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PiMstr.init({
    pi_oid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    pi_dom_id: DataTypes.INTEGER,
    pi_en_id: DataTypes.INTEGER,
    pi_add_by: DataTypes.STRING,
    pi_add_date: DataTypes.DATE,
    pi_upd_by: DataTypes.STRING,
    pi_upd_date: DataTypes.DATE,
    pi_id: DataTypes.INTEGER,
    pi_code: DataTypes.STRING,
    pi_desc: DataTypes.STRING,
    pi_so_type: DataTypes.STRING,
    pi_promo_id: DataTypes.INTEGER,
    pi_cu_id: DataTypes.INTEGER,
    pi_sales_program: DataTypes.INTEGER,
    pi_start_date: DataTypes.DATE,
    pi_end_date: DataTypes.DATE,
    pi_active: DataTypes.STRING,
    pi_dt: DataTypes.DATE,
    pi_ptnrg_id: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    modelName: 'PiMstr',
    tableName: 'pi_mstr',
    timestamps: false
  });
  return PiMstr;
};