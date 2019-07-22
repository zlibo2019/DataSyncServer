/* jshint indent: 2 */

module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const columns = {
    bh: {
      type: STRING,
      allowNull: true
    },
    xh: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false
    }
  }
  
  let sequelize;
  if (!app.env) {
    sequelize = app;
  } else {
    sequelize = app.model;
  }

  const wt_gress = sequelize.define('wt_gress', columns, {
    underscored: true,
    tableName: 'wt_gress',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return wt_gress;
};
