/* jshint indent: 2 */

module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const columns = {
    bh: {
      type: STRING,
      allowNull: true,
      primaryKey: true,
    },
    mc: {
      type: STRING,
      allowNull: true
    },
    lx: {
      type: INTEGER,
      allowNull: true
    },
    valued: {
      type: STRING,
      allowNull: true
    },
    regserial: {
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

  const kt_rule = sequelize.define('kt_rule', columns, {
    underscored: true,
    tableName: 'kt_rule',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return kt_rule;
};
