
module.exports = app => {
  const {
    STRING,
    INTEGER,
    DATE,
  } = app.Sequelize;
  const KQ_JOB_UNIT_INFO = app.model.define('KQ_JOB_UNIT_INFO', {
    ID: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    TASK_NO: {
      type: STRING,
      allowNull: false,
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
    FINISH_FLAG: {
      type: INTEGER,
      allowNull: true
    },
  }, {
      tableName: 'KQ_JOB_UNIT_INFO',
      freezeTableName: true, // Model 对应的表名将与model名相同
      timestamps: false,//去除createAt updateAt
    });
  return KQ_JOB_UNIT_INFO;
};
