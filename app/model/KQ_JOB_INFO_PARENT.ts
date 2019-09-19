
module.exports = app => {
  const {
    STRING,
    INTEGER,

  } = app.Sequelize;
  const KQ_JOB_INFO_PARENT = app.model.define('KQ_JOB_INFO_PARENT', {
    BH: {
      type: STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    START_DATE: {
      type: STRING,
      allowNull: true
    },
    END_DATE: {
      type: STRING,
      allowNull: true
    },
    TASK_START: {
      type: STRING,
      allowNull: true
    },
    TASK_END: {
      type: STRING,
      allowNull: true
    },
    TASK_STATE: {
      type: INTEGER,
      allowNull: true
    },
    GLY_NO: {
      type: STRING,
      allowNull: true
    },
  }, {
      tableName: 'KQ_JOB_INFO_PARENT',
      freezeTableName: true, // Model 对应的表名将与model名相同
      timestamps: false,//去除createAt updateAt
    });
  return KQ_JOB_INFO_PARENT;
};
