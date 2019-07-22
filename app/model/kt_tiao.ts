/* jshint indent: 2 */
import moment = require("moment");
module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const columns = {
    a_user: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    b_user: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    a_rq: {
      type: STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
      get: function () {
        // @ts-ignore
        return moment(this.getDataValue('a_rq')).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    b_rq: {
      type: STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
      get: function () {
        // @ts-ignore
        return moment(this.getDataValue('b_rq')).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    a_bc: {
      type: STRING,
      allowNull: true
    },
    b_bc: {
      type: STRING,
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
    }
  }
  
  let sequelize;
  if (!app.env) {
    sequelize = app;
  } else {
    sequelize = app.model;
  }

  const kt_tiao = sequelize.define('kt_tiao', columns, {
    underscored: true,
    tableName: 'kt_tiao',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return kt_tiao;
};
