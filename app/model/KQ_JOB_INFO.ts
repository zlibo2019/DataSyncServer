import moment = require("moment");
module.exports = app => {
  const {
    STRING,
    INTEGER,
    DATE,
  } = app.Sequelize;
  const KQ_JOB_INFO = app.model.define('KQ_JOB_INFO', {
    TASK_NO: {
      type: STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    START_DATE: {
      type: DATE,
      allowNull: true,
    },
    END_DATE: {
      type: DATE,
      allowNull: true,
    },
    USER_DATA: {
      type: STRING,
      allowNull: true
    },
    FX: {
      type: INTEGER,
      allowNull: true
    },
    LOCK: {
      type: INTEGER,
      allowNull: true
    },
    SERVER_ID: {
      type: STRING,
      allowNull: true
    },
    TASK_STATE: {
      type: STRING,
      allowNull: true
    },
    TASK_START: {
      type: STRING,
      allowNull: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('TASK_START');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
    TASK_END: {
      type: STRING,
      allowNull: true,
      get: function () {
        // @ts-ignore
        let value = this.getDataValue('TASK_END');
        let res;
        if (null === value || '' === value) {
          res = null;
        } else {
          res = moment(value).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
        }
        return res;
      },
    },
    GLY_NO: {
      type: STRING,
      allowNull: true
    },
    DEP_DATA: {
      type: STRING,
      allowNull: true
    },
    TASK_YEAR: {
      type: INTEGER,
      allowNull: true
    },
    TASK_MONTH: {
      type: INTEGER,
      allowNull: true
    },
    TASK_DAY: {
      type: INTEGER,
      allowNull: true
    },
    remarks: {
      type: STRING,
      allowNull: true
    },
    PARENT_BH: {
      type: STRING,
      allowNull: true
    },
  }, {
    tableName: 'KQ_JOB_INFO',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return KQ_JOB_INFO;
};
