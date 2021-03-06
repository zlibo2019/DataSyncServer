/* jshint indent: 2 */

module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const columns = {
    bh: {
      type: STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    mc: {
      type: STRING,
      allowNull: true
    },
    lx: {
      type: INTEGER,
      allowNull: true,
    },
    sfskq: {
      type: INTEGER,
      allowNull: true,
    },
    fh: {
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

  const kt_qingj = sequelize.define('kt_qingj', columns, {
    underscored: true,
    tableName: 'kt_qingj',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return kt_qingj;
};
