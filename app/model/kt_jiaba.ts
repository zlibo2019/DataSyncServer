/* jshint indent: 2 */
import moment = require("moment");
module.exports = app => {
  const {
    INTEGER,
    STRING,
  } = app.Sequelize;
  const columns = {
    // xh: {
    //   type: INTEGER,
    //   allowNull: false,
    //   primaryKey: true,
    //   autoIncrement: false
    // },
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
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
    user_serial: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bh: {
      type: INTEGER,
      allowNull: true,
    },
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

  const kt_jiaba = sequelize.define('kt_jiaba', columns, {
    underscored: true,
    tableName: 'kt_jiaba',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return kt_jiaba;
};
