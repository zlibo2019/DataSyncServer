/* jshint indent: 2 */
import moment = require("moment");
module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const columns = {
    // xh: {
    //   type: INTEGER,
    //   allowNull: false,
    //   primaryKey: true,
    //   autoIncrement: true
    // },
    dep_serial: {
      type: INTEGER,
      allowNull: true
    },
    ct_user: {
      type: STRING,
      allowNull: true,
    },
    ct_date: {
      type: STRING,
      allowNull: true,
      primaryKey: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('ct_date');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
  }
  let sequelize;
  // 自定义的
  if (!app.env) {
    sequelize = app;
  }
  // egg框架的
  else {
    sequelize = app.model;
  }

  const no_fx_dep = sequelize.define('no_fx_dep', columns, {
    underscored: true,
    tableName: 'no_fx_dep',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return no_fx_dep;
};
