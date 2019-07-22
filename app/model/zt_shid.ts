/* jshint indent: 2 */

module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const columns = {
    bh: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false
    },
    parent: {
      type: STRING,
      allowNull: true
    },
    lx: {
      type: INTEGER,
      allowNull: true
    },
    sbsj: {
      type: INTEGER,
      allowNull: true
    },
    xbsj: {
      type: INTEGER,
      allowNull: true
    },
    sbks: {
      type: INTEGER,
      allowNull: true
    },
    xbjs: {
      type: INTEGER,
      allowNull: true
    },
    cdsj: {
      type: INTEGER,
      allowNull: true
    },
    ztsj: {
      type: INTEGER,
      allowNull: true
    },
    bjcd: {
      type: INTEGER,
      allowNull: true
    },
    bjzt: {
      type: INTEGER,
      allowNull: true
    },
    qdqt: {
      type: INTEGER,
      allowNull: true
    },
    sbws: {
      type: STRING,
      allowNull: true
    },
    xbws: {
      type: STRING,
      allowNull: true
    },
    alld: {
      type: STRING,
      allowNull: true
    },
    allt: {
      type: INTEGER,
      allowNull: true
    },
    types: {
      type: INTEGER,
      allowNull: true
    },
    mach: {
      type: INTEGER,
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

  const zt_shid = sequelize.define('zt_shid', columns, {
    underscored: true,
    tableName: 'zt_shid',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return zt_shid;
};
