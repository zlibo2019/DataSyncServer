/* jshint indent: 2 */

module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const columns = {
    user_serial: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rq: {
      type: STRING,
      allowNull: false,
      primaryKey: true
    },
    d1: {
      type: STRING,
      allowNull: true
    },
    d2: {
      type: STRING,
      allowNull: true
    },
    d3: {
      type: STRING,
      allowNull: true
    },
    d4: {
      type: STRING,
      allowNull: true
    },
    d5: {
      type: STRING,
      allowNull: true
    },
    d6: {
      type: STRING,
      allowNull: true
    },
    d7: {
      type: STRING,
      allowNull: true
    },
    d8: {
      type: STRING,
      allowNull: true
    },
    d9: {
      type: STRING,
      allowNull: true
    },
    d10: {
      type: STRING,
      allowNull: true
    },
    d11: {
      type: STRING,
      allowNull: true
    },
    d12: {
      type: STRING,
      allowNull: true
    },
    d13: {
      type: STRING,
      allowNull: true
    },
    d14: {
      type: STRING,
      allowNull: true
    },
    d15: {
      type: STRING,
      allowNull: true
    },
    d16: {
      type: STRING,
      allowNull: true
    },
    d17: {
      type: STRING,
      allowNull: true
    },
    d18: {
      type: STRING,
      allowNull: true
    },
    d19: {
      type: STRING,
      allowNull: true
    },
    d20: {
      type: STRING,
      allowNull: true
    },
    d21: {
      type: STRING,
      allowNull: true
    },
    d22: {
      type: STRING,
      allowNull: true
    },
    d23: {
      type: STRING,
      allowNull: true
    },
    d24: {
      type: STRING,
      allowNull: true
    },
    d25: {
      type: STRING,
      allowNull: true
    },
    d26: {
      type: STRING,
      allowNull: true
    },
    d27: {
      type: STRING,
      allowNull: true
    },
    d28: {
      type: STRING,
      allowNull: true
    },
    d29: {
      type: STRING,
      allowNull: true
    },
    d30: {
      type: STRING,
      allowNull: true
    },
    d31: {
      type: STRING,
      allowNull: true
    },
    gly_no: {
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

  const kt_paiba = sequelize.define('kt_paiba', columns, {
    underscored: true,
    tableName: 'kt_paiba',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return kt_paiba;
};
