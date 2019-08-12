/* jshint indent: 2 */
import moment = require("moment");
module.exports = app => {
  const {
    INTEGER,
    STRING,
  } = app.Sequelize;
  const columns = {
    jbrq: {
      type: STRING,
      allowNull: false,
      primaryKey: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('jbrq');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD');
        }
        return res;
      },
    },
    user_serial: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true
    },
    // xh: {
    //   type: INTEGER,
    //   allowNull: false,
    //   primaryKey: true,
    //   autoIncrement: false
    // },
    kssj: {
      type: STRING,
      allowNull: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('kssj');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
    jssj: {
      type: STRING,
      allowNull: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('jssj');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
    jsjg: {
      type: INTEGER,
      allowNull: true
    },
    if_shenhe: {
      type: INTEGER,
      allowNull: true
    }
  }
  
  let sequelize;
  if (!app.env) {
    sequelize = app;
  } else {
    sequelize = app.model;
  }

  const kt_waich = sequelize.define('kt_waich', columns, {
    underscored: true,
    tableName: 'kt_waich',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return kt_waich;
};
