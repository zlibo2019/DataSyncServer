import { Service } from 'egg';
// @ts-ignore
import { IResult, enumMapTableName } from '../extend/helper';
import moment = require('moment');
export default class TaskService extends Service {
  async runTask() {
    const { ctx, app } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {
      // @ts-ignore
      // for 控制并发量
      // jResult = await ctx.service.serviceTask.getRunningTask();
      // if (jResult.code === -1) {
      //   return jResult;
      // }
      // let curRunningTask = jResult.data;
      // ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' 当前任务数:' + curRunningTask);



      let maxRunningTask = app.config.program.max_running_task;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' 允许最大任务数:' + maxRunningTask);




      // @ts-ignore
      jResult = await ctx.service.serviceTask.loopTask();
      if (jResult.code === -1) {
        return jResult;
      }
      let arrTask = jResult.data;

      for (let i = 0; i < arrTask.length; i++) {
        // let parentState = arrTask[i].parent_state;
        let taskNo = arrTask[i].TASK_NO;
        let parentBh = arrTask[i].PARENT_BH;
        let serverId = arrTask[i].SERVER_ID;
        let startDate = arrTask[i].START_DATE;
        startDate = moment(startDate).format("YYYY-MM-DD");
        let endDate = arrTask[i].END_DATE;
        endDate = moment(endDate).format("YYYY-MM-DD");
        let userData = arrTask[i].USER_DATA;
        let fx = arrTask[i].FX;
        let lock = arrTask[i].LOCK;
        let depData = arrTask[i].DEP_DATA;
        let year = arrTask[i].TASK_YEAR;
        let month = arrTask[i].TASK_MONTH;
        let day = arrTask[i].TASK_DAY;
        let taskState = Number(arrTask[i].TASK_STATE);

        
        let timeOut = this.config.program.task_timeout;
        if (undefined === timeOut) {
          timeOut = 20 * 60 * 1000;
        }

        switch (taskState) {
          case 0: // 新任务,执行同步(从主服务器向分析服务器)
        
            let value = await app.redis.get(`num_running_task`);
            let numRunningTask;
            if (undefined === value || null === value) {
              numRunningTask = 0;
            } else {
              numRunningTask = Number(value);
            }
            ctx.logger.error('当前任务数:' + numRunningTask);
            // 是否超任务数
            if (numRunningTask >= maxRunningTask) {
              continue;
            }

            let mutex = await app.redis.get(`mutex_${serverId}`);
            if (Number(mutex) === 1) {
              continue;
            }

            jResult = await ctx.service.serviceMain2Analyse.main2Analyse(
              parentBh, taskNo, serverId, userData, startDate, endDate, year, month
            );

            break;
          case 1: // 判断同步是否超时

            // @ts-ignore
            jResult = await ctx.service.serviceTask.judgeTaskTimeout(parentBh,taskNo, taskState, timeOut);
            if (jResult.code === -1) {
              continue;
            }
            break;
          case 2: // 数据从主服务器向分析服务器同步完成(执行分析)
            // @ts-ignore
            jResult = await ctx.service.serviceCommon.getServerByServerId(serverId);
            if (jResult.code === -1) {
              continue;
            }
            let server = jResult.data;
            if (undefined === server || null === server) {
              ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + '没有server :' + serverId);
              continue;
            }
            let host = server.DB_IP;
            let urlHead = server.SERVER_URL;
            let instanceName = server.INSTANCE_NAME;
            let port = server.DB_PORT;
            let dbName = server.ESCAPE_NAME;
            let user = server.USER_NAME;
            let pwd = server.USER_PWD;
            ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + `${taskNo}:` + '开始分析');
            setTimeout(async () => {
              // @ts-ignore
              jResult = await ctx.service.serviceAnalyse.callAnalyse(parentBh,
                host, startDate, endDate, userData,
                fx, lock, depData, year, month, day,
                instanceName, port, dbName, user, pwd, taskNo, urlHead
              );
              if (jResult.code === -1) {
                ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
              }
            }, 0);
            break;
          case 3: // 判断分析是否超时
            // @ts-ignore
            jResult = await ctx.service.serviceTask.judgeTaskTimeout(parentBh,taskNo, taskState, timeOut);
            if (jResult.code === -1) {
              continue;
            }
            break;
          case 4: // 分析完成(数据从分析服务器向主服务器同步)


            jResult = await ctx.service.serviceAnalyse2Main.analyse2main(
              parentBh, taskNo, serverId, userData, startDate, endDate, year, month
            );

            break;
          case 5: // 判断反同步是否超时
         
            // @ts-ignore
            jResult = await ctx.service.serviceTask.judgeTaskTimeout(parentBh,taskNo, taskState, timeOut);
            if (jResult.code === -1) {
              continue;
            }
            break;
          default:
        }
      }
      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
      jResult.data = null;

      return jResult;
    }
  };


  async loadServerIntoRedis() {
    const { ctx, app } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {
      let arrServer = await ctx.model.KQSERVERINFO.findAll();
      for (let i = 0; i < arrServer.length; i++) {
        let curServer = arrServer[i];
        let curServerId = curServer.SERVER_ID;
        let host = curServer.DB_IP;
        let dbName = curServer.DB_NAME;
        let port = curServer.DB_PORT;
        let userName = curServer.USER_NAME;
        let pwd = curServer.USER_PWD;
        let instanceName = curServer.INSTANCE_NAME;
        let option = {};
        // @ts-ignore
        option.host = host;
        // @ts-ignore
        option.port = Number(port);
        // @ts-ignore
        option.timezone = '+08:00';
        // option.timezone = 'PRC';
        // @ts-ignore
        option.dialect = 'mssql';
        // @ts-ignore
        option.logging = false;
        // @ts-ignore
        // option.operatorsAliases = true;
        option.dialectOptions = {
          connectTimeout: this.config.program.connectTimeout,
          options: {
            requestTimeout: 999999,
            connectTimeout: this.config.program.connectTimeout,
          },
        };
        if (undefined !== instanceName && null !== instanceName) {
          // @ts-ignore
          option.dialectOptions.options.instanceName = instanceName;
          // // @ts-ignore
          // option.dialectOptions = {
          //   options: {
          //     requestTimeout: 999999,
          //     connectTimeout: this.config.program.connectTimeout,
          //     instanceName: instanceName,
          //   },
          // };
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
        // ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")  + JSON.stringify(connectInfo));
        await app.redis.set(curServerId, JSON.stringify(connectInfo));
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

