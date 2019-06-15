/* jshint indent: 2 */














module.exports = app => {
  const {
    STRING,
    DATE,
  } = app.Sequelize;
  const KQ_SERVER_INFO = app.model.define('KQ_SERVER_INFO', {
    SERVER_ID: {
      type: STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    SERVER_NAME: {
      type: STRING,
      allowNull: true
    },
    DB_NAME: {
      type: STRING,
      allowNull: true
    },
    DB_IP: {
      type: STRING,
      allowNull: true
    },
    DB_PORT: {
      type: STRING,
      allowNull: true
    },
    USER_NAME: {
      type: STRING,
      allowNull: true
    },
    USER_PWD: {
      type: STRING,
      allowNull: true
    },
    SERVER_URL: {
      type: STRING,
      allowNull: true
    },
    SERVER_STATE: {
      type: STRING,
      allowNull: true
    },
    LT_DATE: {
      type: DATE,
      allowNull: true
    },
    GLY_NO: {
      type: STRING,
      allowNull: true
    },
  }, {
      tableName: 'KQ_SERVER_INFO',
      freezeTableName: true, // Model 对应的表名将与model名相同
      timestamps: false,//去除createAt updateAt
    });
  return KQ_SERVER_INFO;
};
