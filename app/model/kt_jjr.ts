/* jshint indent: 2 */
import moment = require("moment");
module.exports = app => {
  const {
    STRING,
  } = app.Sequelize;
  const columns = {
    bh: {
      type: STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    mc: {
      type: STRING,
      allowNull: true
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
    regserial: {
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

  const kt_jjr = sequelize.define('kt_jjr', columns, {
    underscored: true,
    tableName: 'kt_jjr',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return kt_jjr;
};
