import { Service } from 'egg';
import { IResult } from '../extend/helper';
var Sequelize = require('sequelize');

export default class CommonService extends Service {

  /**
   * # 遍历任务表
   */
  async loopTask() {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {
      // @ts-ignore
      let task = await ctx.model.KQJOBINFO.findAll({
        where: {
          TASK_STATE: [0, 2, 4],
        }
      });
      jResult.data = task;
      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      jResult.data = null;
      return jResult;
    }
  }


  async loadServerIntoRedis() {
    const { ctx, app } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {
      // @ts-ignore

      let arrServer = await ctx.model.KQSERVERINFO.findAll();
      for (let i = 0; i < arrServer.length; i++) {
        let curServer = arrServer[i];
        let curServerId = curServer.SERVER_ID;
        let serverName = curServer.SERVER_NAME;
        let dbName = curServer.DB_NAME;
        let port = curServer.DB_PORT;
        let userName = curServer.USER_NAME;
        let pwd = curServer.USER_PWD;
        let instanceName = curServer.INSTANCE_NAME;
        let option = {};
        // @ts-ignore
        option.host = serverName;
        // @ts-ignore
        option.dialectOptions = {
          instanceName: instanceName,
        };
        // @ts-ignore
        option.port = port;
        // @ts-ignore
        option.dialect = 'mssql';

        // @ts-ignore
        option.pool = {
          max: 5,
          min: 0,
          idle: 10000,
        };
        let connectInfo = {};
        // @ts-ignore
        connectInfo.dbName = dbName;
        // @ts-ignore
        connectInfo.userName = userName;
        // @ts-ignore
        connectInfo.pwd = pwd;
        // @ts-ignore
        connectInfo.option = option;
        app.redis.set(curServerId, JSON.stringify(connectInfo))
        var sequelize = new Sequelize(dbName, userName, pwd, option);
        sequelize.query('select * from dt_user');


      }
      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      jResult.data = null;
      return jResult;
    }

  }

  /**
   * # 同步数据
   */
  async syncData(startDate, endDate, userData, serverId) {

    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {
      // @ts-ignore
      jResult = await this.getServerInfoByServerId(serverId);
      if (-1 === jResult.code) {
        return jResult;
      }
      let server = jResult.data;
      server.

        jResult.data = server;
      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      jResult.data = null;
      return jResult;
    }

  }

  /**
   * # 调用数据分析地址
   */
  callAnalyse(url) {

  }

}

