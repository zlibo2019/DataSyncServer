import { Service } from 'egg';
// @ts-ignore
import { IResult, enumMapTableName } from '../extend/helper';
var Sequelize = require('sequelize');
const path = require('path');
import moment = require('moment');

export default class Main2AnalyseService extends Service {




  /**
   * # 主服务同步到分析服务
   */
  async main2Analyse(parentBh, taskNo, serverId, userData, startDate, endDate, year, month) {
    const { ctx,app } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {
      let mutex = await app.redis.get(`mutex_${serverId}`);
      if (undefined === mutex || null === mutex || Number(mutex) === 0) {
        await app.redis.set(`mutex_${serverId}`, 1);
      } else {
        return jResult;
      }


      ctx.logger.error('任务号：' + taskNo);
      if (taskNo === '201909161714513368') {
        ctx.logger.error('201909161714513368aa' + moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
      }

      // @ts-ignore
      jResult = await ctx.service.serviceTask.setTaskState(parentBh, taskNo, 1);   // 同步中
      if (jResult.code === -1) {
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
        await app.redis.set(`mutex_${serverId}`, 0);
        return jResult;
      }


      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + `${taskNo}:` + '开始同步');

      jResult = await this.insertBulkTable(
        serverId, userData, startDate, endDate, year, month, taskNo,
      );
      if (jResult.code === -1) {
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);

        // 停止当前任务
        // @ts-ignore
        let res = await ctx.service.serviceTask.shutdownTask(taskNo, 1);
        // 设置为异常结束 
        // @ts-ignore
        res = await ctx.service.serviceTask.setTaskState(parentBh, taskNo, 9);
        // 置为空闲 
        // @ts-ignore
        res = await ctx.service.serviceTask.set2IdleState(serverId);

        // 置错误信息
        res = await ctx.service.serviceTask.setError(taskNo, jResult.msg);
        await app.redis.set(`mutex_${serverId}`, 0);
        return jResult;
      }
      // @ts-ignore
      jResult = await ctx.service.serviceTask.setTaskState(parentBh, taskNo, 2);    // 同步完成
      if (jResult.code === -1) {
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
        await app.redis.set(`mutex_${serverId}`, 0);
        return jResult;
      }
      await app.redis.set(`mutex_${serverId}`, 0);
      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      jResult.data = null;
      await app.redis.set(`mutex_${serverId}`, 0);
      return jResult;
    }
  }

  /**
    * # 同步单表
    * isForce 是否强制删除原表 1是0否
    */
  // @ts-ignore
  async insertTable(sequelize, root, tableName, condition, isHavePrimaryKey, taskNo) {
    // @ts-ignore
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };

    let tableNameLine;
    try {
      // 转下划线
      // @ts-ignore
      tableNameLine = ctx.service.serviceCommon.toLine(tableName);

      if (tableNameLine === "kt_jl") {
        jResult = await this.insertTableTrans(sequelize, root, tableName, condition, isHavePrimaryKey, taskNo);
      } else {
        jResult = await this.insertTableNoTrans(sequelize, root, tableName, condition, isHavePrimaryKey, taskNo);
      }

      return jResult;
    } catch (err) {

      // await transaction.rollback();
      jResult.code = -1;
      jResult.msg = `taskNo:${taskNo} ${tableNameLine} 表错误:${err.stack}`;
      jResult.data = null;
      return jResult;
    }
  }

  /**
   * # 同步单表
   * isForce 是否强制删除原表 1是0否
   */
  // @ts-ignore
  async insertTableNoTrans(sequelize, root, tableName, condition, isHavePrimaryKey, taskNo) {
    // @ts-ignore
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };

    let tableNameLine;
    let arr;

    // @ts-ignore
    // const transaction = await ctx.model.transaction();
    try {
      // 转下划线
      // @ts-ignore
      tableNameLine = ctx.service.serviceCommon.toLine(tableName);
      const table = await sequelize.import(`${root}\\model\\${tableNameLine}`);

      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + 'select准备加锁:' + taskNo);
      // let sql = `select * from KQ_LOCK with(xlock) where lock_table = '${tableNameLine}'`;
      // // @ts-ignore
      // let res = await ctx.model.query(sql, { transaction });

      // ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + 'res ' + taskNo + JSON.stringify(res));

      // 清空表
      let res = await table.destroy({
        where: {},
        truncate: true,
      });
      if (undefined !== res) {
        jResult.code = -1;
        jResult.msg = `taskNo:${taskNo} ${tableNameLine}  清记录错误`;
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
      } else {
        let msg = `taskNo:${taskNo} ${tableNameLine}  清记录成功`;
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + msg);
      }

      // 如果没有主键,去掉系统默认填加的id
      if (undefined !== isHavePrimaryKey && isHavePrimaryKey === false) {
        eval(`ctx.model.${tableName}.removeAttribute('id')`);
      }

      let functionString;
      if (undefined !== condition) {
        condition.logging = false;
        functionString = `ctx.model.${tableName}.findAll(condition)`;
      } else {
        functionString = `ctx.model.${tableName}.findAll()`;
      }



      let arrs = await eval(functionString); // await ctx.model.DtUser.findAll();
      arr = await arrs.map(i => i.get({ plain: true }));
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ` ${taskNo}:${tableName}记录总数:${arr.length}`);

      res = await table.bulkCreate(arr);
      let msg = `taskNo:${taskNo} ${tableNameLine}  插入记录条数:` + res.length;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + msg);
      // await transaction.commit();
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + 'select解锁:' + taskNo);
      return jResult;
    } catch (err) {

      // await transaction.rollback();
      jResult.code = -1;
      jResult.msg = `taskNo:${taskNo} ${tableNameLine} 表错误:${err.stack}`;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);

      ctx.logger.error(err.sql);
      // ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")  + JSON.stringify(arr));
      jResult.data = null;
      return jResult;
    }
  }


  /**
   * # 同步单表
   * isForce 是否强制删除原表 1是0否
   */
  // @ts-ignore
  async insertTableTrans(sequelize, root, tableName, condition, isHavePrimaryKey, taskNo) {
    // @ts-ignore
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };

    // console.log('kt_jl 加锁..............................');

    let tableNameLine;
    let arr;

    // @ts-ignore
    const transaction = await ctx.model.transaction();
    try {
      // 转下划线
      // @ts-ignore
      tableNameLine = ctx.service.serviceCommon.toLine(tableName);
      const table = await sequelize.import(`${root}\\model\\${tableNameLine}`);

      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + 'select准备加锁:' + taskNo);
      let sql = `select * from KQ_LOCK with(xlock) where lock_table = '${tableNameLine}'`;
      // @ts-ignore
      let res = await ctx.model.query(sql, { transaction });

      // ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + 'res ' + taskNo + JSON.stringify(res));

      // 清空表
      res = await table.destroy({
        where: {},
        truncate: true,
      });
      if (undefined !== res) {
        jResult.code = -1;
        jResult.msg = `taskNo:${taskNo} ${tableNameLine}  清记录错误`;
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
      } else {
        let msg = `taskNo:${taskNo} ${tableNameLine}  清记录成功`;
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + msg);
      }

      // 如果没有主键,去掉系统默认填加的id
      if (undefined !== isHavePrimaryKey && isHavePrimaryKey === false) {
        eval(`ctx.model.${tableName}.removeAttribute('id')`);
      }

      let functionString;
      if (undefined !== condition) {
        condition.logging = false;
        functionString = `ctx.model.${tableName}.findAll(condition)`;
      } else {
        functionString = `ctx.model.${tableName}.findAll()`;
      }



      let arrs = await eval(functionString); // await ctx.model.DtUser.findAll();
      arr = await arrs.map(i => i.get({ plain: true }));
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ` ${taskNo}:${tableName}记录总数:${arr.length}`);

      res = await table.bulkCreate(arr);
      let msg = `taskNo:${taskNo} ${tableNameLine}  插入记录条数:` + res.length;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + msg);
      await transaction.commit();
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + 'select解锁:' + taskNo);
      return jResult;
    } catch (err) {

      await transaction.rollback();
      jResult.code = -1;
      jResult.msg = `taskNo:${taskNo} ${tableNameLine} 表错误:${err.stack}`;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);

      ctx.logger.error(err.sql);
      // ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")  + JSON.stringify(arr));
      jResult.data = null;
      return jResult;
    }
  }

  /**
   * # 批量同步表
   */
  // @ts-ignore
  async insertBulkTable(serverId, userData, startDate, endDate, year, month, taskNo) {

    const { app, ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {
      let connectInfo = await app.redis.get(serverId);
      if (undefined === connectInfo || null === connectInfo) {
        jResult.code = -1;
        jResult.msg = 'connection not find';
        return jResult;
      }
      connectInfo = JSON.parse(connectInfo);
      // @ts-ignore
      let root = path.resolve(__dirname, '..');
      // @ts-ignore
      connectInfo.option.logging = false;

      // @ts-ignore
      var sequelize = await new Sequelize(connectInfo.dbName, connectInfo.userName, connectInfo.pwd, connectInfo.option);

      let arrTable = app.config.program.insertTableList;

      let promiseArr = new Array();

      for (let i = 0; i < arrTable.length; i++) {
        // @ts-ignore
        let curTableName = arrTable[i].name;
        // @ts-ignore
        let isHavePrimaryKey = arrTable[i].isHavePrimaryKey;
        // @ts-ignore
        let curTableCondition;
        if (undefined !== arrTable[i].condition) {
          let condition = arrTable[i].condition;
          let offset = 2;
          // @ts-ignore
          jResult = ctx.service.serviceCommon.formatCondition(
            0, userData, startDate, endDate, year, month, condition, offset
          );
          if (jResult.code === -1) {
            return jResult;
          }
          curTableCondition = jResult.data;
        }
        promiseArr.push(eval(`this.insertTable(sequelize, root, curTableName,curTableCondition,isHavePrimaryKey,taskNo)`));
      }

      let res = await Promise.all(promiseArr);
      if (undefined !== res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          let curResult = res[i];
          if (curResult.code === -1) {
            jResult.code = -1;
            jResult.msg += curResult.msg;
          }
        };
      }

      // if (undefined !== res) {
      //   ctx.logger.error(JSON.stringify(res));
      // }
      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
      jResult.data = null;
      return jResult;
    }
  }
}

