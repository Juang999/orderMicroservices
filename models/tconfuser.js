'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TConfUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TConfUser.belongsTo(models.TConfGroup, {
        as: "group",
        foreignKey: {
          name: "groupid"
        },
        targetKey: "groupid"
      })

      TConfUser.belongsTo(models.PtnrMstr, {
        as: 'detail_user',
        foreignKey: 'user_ptnr_id',
        targetKey: 'ptnr_id'
      })

      TConfUser.belongsTo(models.EnMstr, {
        as: 'entity',
        targetKey: 'en_id',
        foreignKey: 'en_id'
      })

      TConfUser.hasMany(models.VisitMstr, {
        as: 'detail_visitation',
        sourceKey: 'userid',
        foreignKey: 'visit_sales_id'
      })
    }
  }
  TConfUser.init({
    userid: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    userkode: DataTypes.STRING,
    usernama: DataTypes.STRING,
    password: DataTypes.STRING,
    groupid: DataTypes.INTEGER,
    last_access: DataTypes.DATE,
    id_karyawan: DataTypes.INTEGER,
    time_reminder: DataTypes.INTEGER,
    en_id: DataTypes.INTEGER,
    useractive: DataTypes.STRING,
    useremail: DataTypes.STRING,
    usernik: DataTypes.STRING,
    userpidgin: DataTypes.STRING,
    userpidgin_hris: DataTypes.STRING,
    userphone: DataTypes.STRING,
    user_ptnr_id: DataTypes.INTEGER,
    user_imei: DataTypes.STRING,
    nik_id: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'TConfUser',
    schema: 'public',
    tableName: 'tconfuser',
    timestamps: false
  });
  return TConfUser;
};