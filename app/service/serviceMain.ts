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
      let jResult = await ctx.service.serviceTask.getRunningTask();
      if (jResult.code === -1) {
        return jResult;
      }
      let curRunningTask = jResult.data;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' 当前任务数:' + curRunningTask);

      let maxRunningTask = app.config.program.max_running_task;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' 允许最大任务数:' + maxRunningTask);
      // @ts-ignore
      jResult = await ctx.service.serviceTask.loopTask();
      if (jResult.code === -1) {
        return jResult;
      }
      let arrTask = jResult.data;

      for (let i = 0; i < arrTask.length; i++) {
        let taskNo = arrTask[i].TASK_NO;
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

        // 如果人员为空,从部门生成
        if (taskState === 0 || taskState === 4) {
          if (null === userData || '' === userData) {
            // @ts-ignore
            jResult = await ctx.service.serviceCommon.getUserByDep(depData);
            if (jResult.code === -1) {
              return jResult;
            }
            let arrUser = jResult.data;
            let arrUserId = new Array();
            for (let i = 0; i < arrUser.length; i++) {
              arrUserId.push(arrUser[i].user_serial);
            }
            userData = arrUserId.join(',');
          }
        }
        // let curTaskState;
        switch (taskState) {
          case 0: // 新任务,执行同步(从主服务器向分析服务器)
            // @ts-ignore
            jResult = await ctx.service.serviceTask.isConflict(userData);
            if (jResult.code === -1) {
              continue;
            }
            let isConflict = jResult.data;
            // 人员有冲突,置等待状态
            if (isConflict) {
              ctx.logger.error(taskNo + ':有冲突!');
              // @ts-ignore 
              // await ctx.service.serviceTask.setTaskState(taskNo, 8);
              continue;
            }

            // 是否超任务数
            if (curRunningTask >= maxRunningTask) {
              continue;
            }
            curRunningTask++;
            ctx.logger.error('当前任务数:' + curRunningTask);
            setTimeout(async () => {
              // @ts-ignore
              jResult = await ctx.service.serviceMain2Analyse.main2Analyse(
                taskNo, serverId, userData, startDate, endDate, year, month
              );
            }, 0);
            break;
          case 1: // 判断同步是否超时
            // @ts-ignore
            jResult = await ctx.service.serviceTask.judgeTaskTimeout(taskNo, taskState, 120 * 60 * 1000);
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
              jResult = await ctx.service.serviceAnalyse.callAnalyse(
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
            jResult = await ctx.service.serviceTask.judgeTaskTimeout(taskNo, taskState, 120 * 60 * 1000);
            if (jResult.code === -1) {
              continue;
            }
            break;
          case 4: // 分析完成(数据从分析服务器向主服务器同步)

            setTimeout(async () => {
              // @ts-ignore
              jResult = await ctx.service.serviceAnalyse2Main.analyse2main(
                taskNo, serverId, userData, startDate, endDate, year, month
              );
            }, 0);

            break;
          case 5: // 判断反同步是否超时
            // @ts-ignore
            jResult = await ctx.service.serviceTask.judgeTaskTimeout(taskNo, taskState, 120 * 60 * 1000);
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
        app.redis.set(curServerId, JSON.stringify(connectInfo));
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

