import { Service } from 'egg';
// @ts-ignore
import { IResult, enumMapTableName } from '../extend/helper';
import moment = require('moment');

export default class TaskService extends Service {



  /**
   * # 人员是否有冲突
   */
  async isConflict(users) {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: false,
    };
    try {
      let arrJob = await ctx.model.KQJOBINFO.findAll({
        where: {
          TASK_STATE: {
            $between: [1, 5]
          }
        }
      });
      let arrUser = users.split(",");
      if (undefined !== arrJob && arrJob.length > 0) {
        for (let i = 0; i < arrJob.length; i++) {
          let curUsers = arrJob[i].USER_DATA;
          let curArrUser = curUsers.split(",");
          let arrAll = arrUser.concat(curArrUser);
          // @ts-ignore
          let isConflict = ctx.service.serviceCommon.checkDuplicationNormal(arrAll);
          if (isConflict && isConflict === true) {
            jResult.data = true;
            ctx.logger.error('冲突任务:' +  arrJob[i].TASK_NO);
            ctx.logger.error('冲突人员:' + arrAll);
            return jResult;
          }
        }
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
   * # 主服务同步到分析服务
   */
  async getRunningTask() {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: 0
    };
    try {
      let res = await ctx.model.KQJOBINFO.findAll({
        where: {
          TASK_STATE: {
            $between: [1, 5]
          }
        }
      });
      if (undefined !== res) {
        jResult.data = res.length;
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
      let arrTask = await ctx.model.KQJOBINFO.findAll();
      jResult.data = arrTask;
      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      jResult.data = null;
      return jResult;
    }
  }


  /**
   * # 强制停止任务
   */
  async shutdownTask(taskNo, taskState) {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {
      // @ts-ignore
      let res = await ctx.model.KQJOBUNITINFO.update({
        TASK_END: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        FINISH_FLAG: 2,
      }, {
          where: {
            TASK_NO: taskNo,
            TASK_STATE: taskState,
            FINISH_FLAG: 0,
          },
        });

      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      jResult.data = null;
      return jResult;
    }
  }

  /**
  * # 查询任务状态
  */
  async getTaskState(taskNo) {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {
      // @ts-ignore
      let res = await ctx.model.KQJOBINFO.findOne({
        where: {
          TASK_NO: taskNo,
        },
      });

      jResult.data = Number(res.TASK_STATE);
      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      jResult.data = null;
      return jResult;
    }
  }



  /**
   * # 置状态
   */
  async setTaskState(taskNo, taskState) {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    // @ts-ignore
    const transaction = await ctx.model.transaction();
    try {

      // 如果已经存在该任务且正在执行，则将其强制结束
      await this.shutdownTask(taskNo, taskState);

      //  更新
      taskState = Number(taskState);
      let value = {};
      // @ts-ignore
      value.TASK_STATE = taskState;
      if (taskState === 6 || taskState === 9) {
        // @ts-ignore
        value.TASK_END = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      } else if (taskState === 1) {
        // @ts-ignore
        value.TASK_START = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      }
      let res = await ctx.model.KQJOBINFO.update(value, {
        where: {
          TASK_NO: taskNo,
        },
      });
      if (res.length < 1) {
        await transaction.rollback();
        jResult.code = -1;
        jResult.msg = 'task not find';
        return jResult;
      }

      // 查询serverId
      res = await ctx.model.KQJOBINFO.findOne({
        where: {
          TASK_NO: taskNo,
        }
      })
      let serverId = res.SERVER_ID;
      switch (taskState) {
        case 1: // 数据从主服务器向分析服务器同步完成(执行分析)
          // @ts-ignore
          res = await ctx.model.KQJOBUNITINFO.create({
            TASK_NO: taskNo,
            SERVER_ID: serverId,
            TASK_STATE: taskState,
            FINISH_FLAG: 0,
            TASK_START: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
          })

          // 服务器置忙碌状态
          res = await ctx.model.KQSERVERINFO.update({
            SERVER_STATE: 1,
          }, {
              where: {
                SERVER_ID: serverId,
              },
            });

          break;
        case 6: // 结束
          // 更新任务块结束时间
          res = await ctx.model.KQJOBUNITINFO.update({
            TASK_END: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            FINISH_FLAG: 1,
          }, {
              where: {
                TASK_NO: taskNo,
                TASK_STATE: taskState - 1,
                FINISH_FLAG: 0,
              },
            });

          jResult = await this.set2IdleState(serverId);
          if (jResult.code === -1) {
            await transaction.rollback();
            jResult.code = -1;
            jResult.msg = 'task not find';
            return jResult;
          }

          break;
        case 9: // 异常结束
          ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + '因异常强制结束:' + taskNo);

          jResult = await this.set2IdleState(serverId);
          if (jResult.code === -1) {
            await transaction.rollback();
            jResult.code = -1;
            jResult.msg = 'task not find';
            return jResult;
          }

          break;
        default:
          // @ts-ignore
          res = await ctx.model.KQJOBUNITINFO.update({
            TASK_END: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            FINISH_FLAG: 1,
          }, {
              where: {
                TASK_NO: taskNo,
                TASK_STATE: taskState - 1,
                FINISH_FLAG: 0,
              },
            });
          // @ts-ignore
          res = await ctx.model.KQJOBUNITINFO.create({
            TASK_NO: taskNo,
            SERVER_ID: serverId,
            TASK_STATE: taskState,
            TASK_START: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            FINISH_FLAG: 0,
          });
      }
      await transaction.commit();
      return jResult;
    } catch (err) {
      await transaction.rollback();
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      jResult.data = null;
      return jResult;
    }
  }


  /**
   * # 置服务器为空闲状态,并将等待该服务器的其中一个任务置为可执行0
   */
  async set2IdleState(serverId) {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: 0
    };
    // @ts-ignore
    const transaction = await ctx.model.transaction();
    try {

      // 任务列表中该服务器如果为等待状态置为可执行
      let res = await ctx.model.KQJOBINFO.findOne({
        where: {
          SERVER_ID: serverId,
          TASK_STATE: 8,
        }
      })
      if (undefined !== res && null !== res) {
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + '等待转空闲,任务号:' + res.TASK_NO);
        await ctx.model.KQJOBINFO.update({
          TASK_STATE: 0,
        }, {
            where: {
              TASK_NO: res.TASK_NO,
            },
          });
      } else {
        // 服务器置回空闲状态
        res = await ctx.model.KQSERVERINFO.update({
          SERVER_STATE: 0,
        }, {
            where: {
              SERVER_ID: serverId,
            },
          });
      }
      await transaction.commit();
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
   * # 判断任务是否超时
   */
  async judgeTaskTimeout(taskNo, taskState, value) {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: 0
    };
    try {

      let nowTime = new Date().getTime();
      let res = await ctx.model.KQJOBUNITINFO.findOne({
        attributes: ['TASK_START'],
        where: {
          TASK_NO: taskNo,
          TASK_STATE: taskState,
          FINISH_FLAG: 0,
        }
      });

      let startTime = nowTime;
      if (undefined !== res && null !== res) {
        startTime = new Date(res.TASK_START).getTime();
      };

      let interval = nowTime - startTime;
      if (interval > value) {
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + `${taskNo}:` + '执行超时');

        // 停止当前操作
        // @ts-ignore
        jResult = await ctx.service.serviceTask.shutdownTask(taskNo, taskState);
        if (jResult.code === -1) {
          ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
          return jResult;
        }
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + `${taskNo}:` + '强制停止任务');

        // 重新执行
        // @ts-ignore
        jResult = await ctx.service.serviceTask.setTaskState(taskNo, taskState - 1);
        if (jResult.code === -1) {
          ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
          return jResult;
        }

        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + `${taskNo}:` + '重新执行任务');
      }

      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      jResult.data = null;
      return jResult;
    }
  }
}

