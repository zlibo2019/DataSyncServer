/* jshint indent: 2 */
import moment = require("moment");
module.exports = app => {
  const {
    STRING,
    INTEGER,
    BIGINT,
  } = app.Sequelize;

  const columns = {
    user_serial: {
      type: BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    user_no: {
      type: STRING,
      allowNull: false,
    },
    user_lname: {
      type: STRING,
      allowNull: true
    },
    user_fname: {
      type: STRING,
      allowNull: true
    },
    dep_no: {
      type: STRING,
      allowNull: true
    },
    user_dep: {
      type: INTEGER,
      allowNull: true
    },
    user_depname: {
      type: STRING,
      allowNull: true
    },
    user_workday: {
      type: STRING,
      allowNull: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('user_workday');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
    user_duty: {
      type: STRING,
      allowNull: true
    },
    user_card: {
      type: STRING,
      allowNull: true
    },
    user_finger: {
      type: STRING,
      allowNull: true
    },
    user_password: {
      type: STRING,
      allowNull: true
    },
    pwd_begin: {
      type: STRING,
      allowNull: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('pwd_begin');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
    pwd_end: {
      type: STRING,
      allowNull: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('pwd_end');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
    user_type: {
      type: INTEGER,
      allowNull: true
    },
    pact_begin: {
      type: STRING,
      allowNull: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('pact_begin');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
    pact_end: {
      type: STRING,
      allowNull: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('pact_end');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
    user_level: {
      type: INTEGER,
      allowNull: true
    },
    user_photo: {
      type: INTEGER,
      allowNull: true
    },
    user_sex: {
      type: STRING,
      allowNull: true
    },
    user_nation: {
      type: STRING,
      allowNull: true
    },
    user_xueli: {
      type: STRING,
      allowNull: true
    },
    user_native: {
      type: STRING,
      allowNull: true
    },
    user_birthday: {
      type: STRING,
      allowNull: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('user_birthday');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
    user_id: {
      type: STRING,
      allowNull: true
    },
    user_post: {
      type: STRING,
      allowNull: true
    },
    user_linkman: {
      type: STRING,
      allowNull: true
    },
    user_telephone: {
      type: STRING,
      allowNull: true
    },
    user_address: {
      type: STRING,
      allowNull: true
    },
    user_email: {
      type: STRING,
      allowNull: true
    },
    user_1: {
      type: STRING,
      allowNull: true
    },
    user_2: {
      type: STRING,
      allowNull: true
    },
    user_bz: {
      type: STRING,
      allowNull: true
    },
    kq_rule: {
      type: STRING,
      allowNull: true
    },
    kq_taoban: {
      type: STRING,
      allowNull: true
    },
    kq_tiaoxiu: {
      type: INTEGER,
      allowNull: true
    },
    xf_time: {
      type: STRING,
      allowNull: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('xf_time');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
    xf_jiange: {
      type: INTEGER,
      allowNull: true
    },
    xf_je: {
      type: INTEGER,
      allowNull: true
    },
    user_sj: {
      type: STRING,
      allowNull: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('user_sj');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
    user_rank: {
      type: STRING,
      allowNull: true
    },
    gly_img: {
      type: INTEGER,
      allowNull: true
    },
    user_ac: {
      type: INTEGER,
      allowNull: true
    },
    user_gsbh: {
      type: STRING,
      allowNull: true
    },
    user_yglx: {
      type: STRING,
      allowNull: true
    },
    user_zhbh: {
      type: STRING,
      allowNull: true
    },
    user_zhlx: {
      type: STRING,
      allowNull: true
    },
    user_txm: {
      type: STRING,
      allowNull: true
    },
    user_lx: {
      type: INTEGER,
      allowNull: true
    },
    user_mj: {
      type: INTEGER,
      allowNull: true
    },
    user_identity: {
      type: INTEGER,
      allowNull: true
    },
    user_face: {
      type: INTEGER,
      allowNull: true,
    },
    lx: {
      type: INTEGER,
      allowNull: true
    },
  }

  let sequelize;
  if (!app.env) {
    sequelize = app;
  } else {
    sequelize = app.model;
  }

  const dt_user = sequelize.define('dt_user', columns, {
    underscored: true,
    tableName: 'dt_user',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return dt_user;
};
