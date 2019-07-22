
/* jshint indent: 2 */
import moment = require("moment");
module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const columns = {
    bh: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    sj: {
      type: STRING,
      allowNull: true,
      primaryKey: true,
      get: function () {
        // @ts-ignore
        return moment(this.getDataValue('sj')).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    user_serial: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true
    },

    fx: {
      type: INTEGER,
      allowNull: false
    },
    lx: {
      type: INTEGER,
      allowNull: false,
    },
    yich: {
      type: INTEGER,
      allowNull: false,
    },
    iden: {
      type: STRING,
      allowNull: true
    },
    dev_serial: {
      type: STRING,
      allowNull: true
    },
    dev_state: {
      type: INTEGER,
      allowNull: true
    },
    jlzp_serial: {
      type: INTEGER,
      allowNull: true
    },
    gly_no: {
      type: STRING,
      allowNull: true
    },
    shenhe: {
      type: INTEGER,
      allowNull: true
    },
    dev_logic_bh: {
      type: INTEGER,
      allowNull: true
    },
    deal_state: {
      type: INTEGER,
      allowNull: true,
    },
    recordno: {
      type: STRING,
      allowNull: true
    },
    jcard: {
      type: STRING,
      allowNull: true
    },
    door_state: {
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

  const kt_jl = sequelize.define('kt_jl', columns, {
    underscored: true,
    tableName: 'kt_jl',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return kt_jl;
};
