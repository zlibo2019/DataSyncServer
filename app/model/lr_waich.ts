/* jshint indent: 2 */
import moment = require("moment");
module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const columns = {
    user_serial: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bh: {
      type: STRING,
      allowNull: true
    },
    kssj: {
      type: STRING,
      allowNull: true,
      primaryKey: true,
      get: function () {
        // @ts-ignore
        return moment(this.getDataValue('kssj')).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    jssj: {
      type: STRING,
      allowNull: true,
      primaryKey: true,
      get: function () {
        // @ts-ignore
        return moment(this.getDataValue('jssj')).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    jsjg: {
      type: INTEGER,
      allowNull: true
    },
    bz: {
      type: STRING,
      allowNull: true
    },
    gly_no: {
      type: STRING,
      allowNull: true
    },
    shenhe: {
      type: STRING,
      allowNull: true
    },
    lx: {
      type: INTEGER,
      allowNull: true
    },
    jbrq: {
      type: STRING,
      allowNull: true,
      get: function () {
        // @ts-ignore
        return moment(this.getDataValue('jbrq')).utcOffset(0).format('YYYY-MM-DD');
      },
    },
    parent_xh: {
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

  const lr_waich = sequelize.define('lr_waich', columns, {
    underscored: true,
    tableName: 'lr_waich',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return lr_waich;
};
