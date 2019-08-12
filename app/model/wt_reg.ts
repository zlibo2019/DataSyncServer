/* jshint indent: 2 */
import moment = require("moment");
module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const columns = {
    reg_unit: {
      type: STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    reg_no: {
      type: STRING,
      allowNull: true
    },
    reg_dep: {
      type: INTEGER,
      allowNull: true
    },
    reg_user: {
      type: INTEGER,
      allowNull: true
    },
    reg_version: {
      type: STRING,
      allowNull: true
    },
    reg_connect: {
      type: INTEGER,
      allowNull: true,
      
    },
    reg_time: {
      type: STRING,
      allowNull: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('reg_time');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
    zhangtao_rq: {
      type: INTEGER,
      allowNull: true
    },
    fh_pjz: {
      type: STRING,
      allowNull: true
    },
    fh_pj: {
      type: STRING,
      allowNull: true
    },
    fh_zj: {
      type: STRING,
      allowNull: true
    },
    fh_jj: {
      type: STRING,
      allowNull: true
    },
    fh_xx: {
      type: STRING,
      allowNull: true
    },
    fh_cd: {
      type: STRING,
      allowNull: true
    },
    fh_zt: {
      type: STRING,
      allowNull: true
    },
    fh_sbws: {
      type: STRING,
      allowNull: true
    },
    fh_xbws: {
      type: STRING,
      allowNull: true
    },
    mrgz: {
      type: STRING,
      allowNull: true
    },
    mrbc: {
      type: STRING,
      allowNull: true
    },
    fh_jr: {
      type: STRING,
      allowNull: true
    },
    reg_trans: {
      type: INTEGER,
      allowNull: true
    },
    card_len: {
      type: INTEGER,
      allowNull: true
    },
    area_serial: {
      type: INTEGER,
      allowNull: true
    },
    card_num: {
      type: INTEGER,
      allowNull: true
    },
    // bh: {
    //   type: INTEGER,
    //   allowNull: false
    // },
    reg_company: {
      type: STRING,
      allowNull: true
    },
    reg_serial: {
      type: STRING,
      allowNull: true
    },
    user_num: {
      type: INTEGER,
      allowNull: true
    },
    reg_code: {
      type: STRING,
      allowNull: true
    },
    version_bz: {
      type: INTEGER,
      allowNull: true
    },
    code_key: {
      type: STRING,
      allowNull: true
    },
    organ_id: {
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

  const wt_reg = sequelize.define('wt_reg', columns, {
    underscored: true,
    tableName: 'wt_reg',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return wt_reg;
};
