
module.exports = app => {
  const {
    STRING,
  } = app.Sequelize;
  const KQ_LOCK = app.model.define('KQ_LOCK', {
    lock_table: {
      type: STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
  }, {
      tableName: 'KQ_LOCK',
      freezeTableName: true, // Model 对应的表名将与model名相同
      timestamps: false,//去除createAt updateAt
    });
  return KQ_LOCK;
};
