
/* jshint indent: 2 */
import moment = require("moment");
module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const columns = {
    out_day: {
      type: STRING,
      allowNull: true,
      primaryKey: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('out_day');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD 00:00:00');
        }
        return res;
      },
    },
    user_serial: {
      type: INTEGER,
      allowNull: false,
      primaryKey: false,
    },
    out_sj: {
      type: INTEGER,
      allowNull: true
    },
    out_cs: {
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

  const yich_wc = sequelize.define('yich_wc', columns, {
    underscored: true,
    tableName: 'yich_wc',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return yich_wc;
};
