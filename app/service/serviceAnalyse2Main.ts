import { Service } from 'egg';
// @ts-ignore
import { IResult, enumMapTableName } from '../extend/helper';
var Sequelize = require('sequelize');
const path = require('path');
import moment = require('moment');

export default class Analyse2MainService extends Service {




  /**
   * # 分析服务同步到主服务
   */
  async analyse2main(taskNo, serverId, userData, startDate, endDate, year, month) {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {
      jResult = await ctx.service.serviceTask.setTaskState(taskNo, 5);    // 反向同步中
      if (jResult.code === -1) {
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
        return jResult;
      }

      jResult = await this.reverseSynBulkTable(
        serverId, userData, startDate, endDate, year, month, taskNo,
      );
      if (jResult.code === -1) {
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);

        // 停止当前任务
        // @ts-ignore
        jResult = await ctx.service.serviceTask.shutdownTask(taskNo, 5);
        // 设置为异常结束
        // @ts-ignore
        jResult = await ctx.service.serviceTask.setTaskState(taskNo, 9);
        // 置为空闲 
        // @ts-ignore
        jResult = await ctx.service.serviceTask.set2IdleState(serverId);
        return jResult;
      }
      // @ts-ignore

      jResult = await ctx.service.serviceTask.setTaskState(taskNo, 6);     // 所有流程完成
      if (jResult.code === -1) {
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
        return jResult;
      }
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + `${taskNo}:` + '结束');

      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      jResult.data = null;
      return jResult;
    }
  }


  /**
   * # 反向同步单表
   */
  async reverseInsertTable(sequelize, root, tableName, condition, taskNo) {
    // @ts-ignore
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    taskNo;
    // let reverseTableName = this.getReverseTableName(tableName);

    let tableNameLine;
    // @ts-ignore
    // const transaction = await ctx.model.transaction();
    try {
      // 转下划线
      // @ts-ignore
      tableNameLine = ctx.service.serviceCommon.toLine(tableName);
      const table = await sequelize.import(`${root}\\model\\${tableNameLine}`);

      let arrs;
      if (undefined !== condition && null !== condition) {
        condition.logging = false;
        arrs = await table.findAll(condition);
      } else {
        arrs = await table.findAll();
      }

      // @ts-ignore
      let arr = await arrs.map(i => i.get({ plain: true }));

      // // 加锁
      // let sql = `select 1  from KQ_LOCK with(xlock) where  lock_table = '${tableNameLine}'`;
      // // @ts-ignore
      // await ctx.model.query(sql, { type: sequelize.QueryTypes.select });

      // 删除记录
      let functionString;
      if (undefined !== condition && null !== condition) {
        condition.logging = false;
        functionString = `ctx.model.${tableName}.destroy(condition)`;
      } else {
        functionString = `ctx.model.${tableName}.destroy({where: {},
          truncate: true})`;
      }
      await eval(functionString);

      let dataLength = arr.length;
      let pageSize = 5000;
      let pageCount = Math.ceil(dataLength / pageSize);
      if (pageCount === 0) {
        pageCount++;
      }
      for (let i = 0; i < pageCount; i++) {
        let beginIndex = i * pageSize;
        let endIndex = beginIndex + pageSize;
        let curArr = arr.slice(beginIndex, endIndex);
        curArr;
        // ctx.logger.error(
        //   moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ` ${taskNo}:反向${tableName}记录总数:${curArr.length}`
        // );
        functionString = `ctx.model.${tableName}.bulkCreate(curArr)`;
        await eval(functionString);
      }
      // await transaction.commit();
      return jResult;
    } catch (err) {
      // await transaction.rollback();
      jResult.code = -1;
      jResult.msg = `${tableNameLine}${err.stack}`;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
      jResult.data = null;
      return jResult;
    }
  }


  /**
   * # 测试
   */
  // @ts-ignore
  async lockTable(sequelize, root, taskNo) {

    // @ts-ignore
    const { ctx, app } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    // @ts-ignore
    const transaction = await ctx.model.transaction();
    try {

      // 加锁 更新kt_jl 
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + '测试加锁:' + taskNo);
      let sql = `select * from KQ_LOCK with(rowlock,xlock) where lock_table = 'kt_jl'`
      // @ts-ignore
      let res = await ctx.model.query(sql, transaction);
      console.log('测试res' + JSON.stringify(res));

      sql = `waitfor Delay '00:05:00'`
      // @ts-ignore
      res = await ctx.model.query(sql, transaction);


      await transaction.commit();
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + '测试解锁:' + taskNo);
      return jResult;
    } catch (err) {
      await transaction.rollback();
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + '测试' + jResult.msg);
      jResult.data = null;
      return jResult;
    }
  }




  /**
   * # 反向同步单表
   */
  // @ts-ignore
  async reverseUpdateTable(sequelize, root, taskNo) {

    // @ts-ignore
    const { ctx, app } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    // @ts-ignore
    const transaction = await ctx.model.transaction();
    try {
      // 转下划线

      const table = await sequelize.import(`${root}\\model\\kt_jl`);
      let arrs = await table.findAll({
        attributes: ['bh', 'lx'],
      });
      // @ts-ignore
      let arr = await arrs.map(i => i.get({ plain: true }));


      // 加锁 更新kt_jl 
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + 'update准备加锁:' + taskNo);
      let sql = `select * from KQ_LOCK with(rowlock,xlock) where lock_table = 'kt_jl'`
      // @ts-ignore
      let res = await ctx.model.query(sql, { transaction });
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + 'res ' + taskNo + JSON.stringify(res));

      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + 'update成功加锁:' + taskNo);
      // sql = `waitfor Delay '00:05:00'`
      // // @ts-ignore
      // res = await ctx.model.query(sql, { transaction });


      // 清空表
      res = await ctx.model.KtJlTmp.destroy({
        where: {},
        truncate: true,
      });
      if (undefined !== res) {
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + `考勤记录清除失败`);
      } else {
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + `考勤记录清除成功`);
      }


      // @ts-ignore
      res = await ctx.model.KtJlTmp.bulkCreate(arr);
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + `考勤记录插入条数:` + res.length);

      // @ts-ignore

      sql = `update kt_jl 
                set kt_jl.lx = kt_jl_tmp.lx
                from kt_jl 
                inner join kt_jl_tmp on kt_jl.bh = kt_jl_tmp.bh`;
      // @ts-ignore
      res = await ctx.model.query(sql, { type: sequelize.QueryTypes.update });
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + `考勤记录更新条数` + res.length);

      await transaction.commit();
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + 'update解锁:' + taskNo);
      return jResult;
    } catch (err) {
      await transaction.rollback();
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
      jResult.data = null;
      return jResult;
    }
  }



  /**
   * # 从分析服务器向主服务器同步数据
   */
  // @ts-ignore
  async reverseSynBulkTable(serverId, userData, startDate, endDate, year, month, taskNo) {
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
      const Op = Sequelize.Op;
      // @ts-ignore
      const operatorsAliases = {
        $in: Op.in,
        $between: Op.between,
      };
      // @ts-ignore 支持别名
      connectInfo.option.operatorsAliases = operatorsAliases;
      // @ts-ignore
      connectInfo.option.logging = false;
      // @ts-ignore
      var sequelize = await new Sequelize(connectInfo.dbName, connectInfo.userName, connectInfo.pwd, connectInfo.option);

      let arrTable = app.config.program.reverseInsertTableList;
      // let arrUpdateTable = app.config.program.reverseUpdateTableList;

      let promiseArr = new Array();

      for (let i = 0; i < arrTable.length; i++) {
        // @ts-ignore
        let curTableName = arrTable[i].name;
        // @ts-ignore
        let curTableCondition;
        if (undefined !== arrTable[i].condition && null !== arrTable[i].condition) {
          let condition = arrTable[i].condition;
          // @ts-ignore
          jResult = ctx.service.serviceCommon.formatCondition(0, userData, startDate, endDate, year, month, condition, 1);
          if (jResult.code === -1) {
            return jResult;
          }
          curTableCondition = jResult.data;
        }
        promiseArr.push(eval(`this.reverseInsertTable(sequelize, root, curTableName,curTableCondition,taskNo)`));
      }

      promiseArr.push(eval(`this.reverseUpdateTable(sequelize, root,taskNo)`));

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

