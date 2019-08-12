
/* jshint indent: 2 */
import moment = require("moment");
module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const columns = {
    // bh: {
    //   type: INTEGER,
    //   allowNull: false,
    //   primaryKey: true,
    //   autoIncrement: false,
    // },
    sj: {
      type: STRING,
      allowNull: false,
      primaryKey: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('sj');
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
      primaryKey: false,
    },
    lx: {
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

  const zt_yich = sequelize.define('zt_yich', columns, {
    underscored: true,
    tableName: 'zt_yich',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return zt_yich;
};
