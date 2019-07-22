
/* jshint indent: 2 */
module.exports = app => {
  const {
    INTEGER,
  } = app.Sequelize;
  const columns = {
    bh: {
      type: INTEGER,
      allowNull: false,
    },
    lx: {
      type: INTEGER,
      allowNull: true,
    },
    yich: {
      type: INTEGER,
      allowNull: true,
    },
  }
  let sequelize;
  if (!app.env) {
    sequelize = app;
  } else {
    sequelize = app.model;
  }

  const kt_jl_tmp = sequelize.define('kt_jl_tmp', columns, {
    underscored: true,
    tableName: 'kt_jl_tmp',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return kt_jl_tmp;
};
