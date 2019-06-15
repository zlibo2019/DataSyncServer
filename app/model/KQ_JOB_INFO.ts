/* jshint indent: 2 */

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
      allowNull: true
    },
    END_DATE: {
      type: DATE,
      allowNull: true
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
      type: DATE,
      allowNull: true
    },
    TASK_END: {
      type: DATE,
      allowNull: true
    },
    GLY_NO: {
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
