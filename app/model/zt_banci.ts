/* jshint indent: 2 */

module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const columns = {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false
    },
    bh: {
      type: STRING,
      allowNull: true
    },
    mc: {
      type: STRING,
      allowNull: true
    },
    fh: {
      type: STRING,
      allowNull: true
    },
    kssj: {
      type: INTEGER,
      allowNull: true
    },
    jssj: {
      type: INTEGER,
      allowNull: true
    },
    regserial: {
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

  const zt_banci = sequelize.define('zt_banci', columns, {
    underscored: true,
    tableName: 'zt_banci',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return zt_banci;
};
