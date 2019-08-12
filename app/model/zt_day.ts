/* jshint indent: 2 */
import moment = require("moment");
module.exports = app => {
  const {
    STRING,
    INTEGER,
    FLOAT,
  } = app.Sequelize;

  const columns = {
    user_serial: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dkrq: {
      type: STRING,
      allowNull: false,
      primaryKey: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('dkrq');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD');
        }
        return res;
      },
    },
    yingchu1: {
      type: FLOAT,
      allowNull: true
    },
    yingchu2: {
      type: INTEGER,
      allowNull: true
    },
    shichu1: {
      type: FLOAT,
      allowNull: true
    },
    shichu2: {
      type: INTEGER,
      allowNull: true
    },
    other1: {
      type: FLOAT,
      allowNull: true
    },
    other2: {
      type: INTEGER,
      allowNull: false
    },
    kugong: {
      type: FLOAT,
      allowNull: true
    },
    cdshi: {
      type: INTEGER,
      allowNull: true
    },
    cdci: {
      type: INTEGER,
      allowNull: true
    },
    ztshi: {
      type: INTEGER,
      allowNull: true
    },
    ztci: {
      type: INTEGER,
      allowNull: true
    },
    yqd: {
      type: INTEGER,
      allowNull: true
    },
    yqt: {
      type: INTEGER,
      allowNull: true
    },
    wqd: {
      type: INTEGER,
      allowNull: true
    },
    wqt: {
      type: INTEGER,
      allowNull: true
    },
    sj1: {
      type: STRING,
      allowNull: true
    },
    sj2: {
      type: STRING,
      allowNull: true
    },
    sj3: {
      type: STRING,
      allowNull: true
    },
    sj4: {
      type: STRING,
      allowNull: true
    },
    xxr: {
      type: INTEGER,
      allowNull: true
    },
    jjr: {
      type: INTEGER,
      allowNull: true
    },
    xx: {
      type: INTEGER,
      allowNull: true
    },
    jbzao: {
      type: INTEGER,
      allowNull: true
    },
    jbwan: {
      type: INTEGER,
      allowNull: true
    },
    jbzong: {
      type: INTEGER,
      allowNull: true
    },
    jbzhou: {
      type: INTEGER,
      allowNull: true
    },
    jbjie: {
      type: INTEGER,
      allowNull: true
    },
    fh: {
      type: STRING,
      allowNull: true
    },
    yfh: {
      type: STRING,
      allowNull: true
    },
    banci: {
      type: STRING,
      allowNull: true
    },
    tiao: {
      type: INTEGER,
      allowNull: true
    },
    ycd: {
      type: INTEGER,
      allowNull: true
    },
    yzt: {
      type: INTEGER,
      allowNull: true
    },
    qjsj: {
      type: INTEGER,
      allowNull: true
    },
    qjfh: {
      type: STRING,
      allowNull: true
    },
    xxcs: {
      type: INTEGER,
      allowNull: true
    },
    qjcs: {
      type: INTEGER,
      allowNull: true
    },
    jbcs: {
      type: INTEGER,
      allowNull: true
    },
    shenhe: {
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

  const zt_day = sequelize.define('zt_day', columns, {
    underscored: true,
    tableName: 'zt_day',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return zt_day;
};
