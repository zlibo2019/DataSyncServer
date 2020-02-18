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
            ctx.logger.error('冲突任务:' + arrJob[i].TASK_NO);
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
   * # 置错误
   */
  async setError(taskNo, errInfo) {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: 0
    };
    try {
      await ctx.model.KQJOBINFO.update({
        remarks: errInfo,
      }, {
        where: {
          TASK_NO: taskNo,
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
      // let mutexTask = await app.redis.get(`mutex_task`);
      // if (Number(mutexTask) === 1) {
      //   jResult.code = -1;
      //   jResult.msg = 'task表正在使用';
      //   return jResult;
      // }

      // @ts-ignore
      // let arrTask = await ctx.model.KQJOBINFO.findAll();
      // task_state 0 没执行 1 执行中 2 成功 3 失败
      // 每次只执行一个主任务
      let arrTask = await ctx.model.query(`
      select a.parent_state,b.* from 
      (
      select top 1 bh,task_state parent_state 
      from kq_job_info_parent
      where task_state < 2
      )a inner join kq_job_info b on a.bh = b.parent_bh
      where b.task_state not in(6,9)
      order by b.task_no`
      );

      jResult.data = arrTask[0];
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
  async getTaskInfo(taskNo) {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {
      // let mutexTask = await app.redis.get(`mutex_task`);
      // if (Number(mutexTask) === 1) {
      //   return jResult;
      // }


      // @ts-ignore
      let res = await ctx.model.KQJOBINFO.findOne({
        where: {
          TASK_NO: taskNo,
        },
      });

      jResult.data = res; // Number(res.TASK_STATE);
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
  async isFinished(parentBh) {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: false
    };

    try {
      // @ts-ignore
      let res = await ctx.model.query(
        `select count(1) as counts
      from kq_job_info 
      where task_state <> 6 and parent_bh = '${parentBh}'`
      );

      if (res[0].length > 0 && res[0][0].counts === 0) {
        jResult.data = true;
      }
      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      jResult.data = false;
      return jResult;
    }
  }


  /**
   * # 查询任务状态
   */
  async flushRedis() {
    const { app } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: false
    };
    try {
      await app.redis.flushdb();
      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      jResult.data = false;
      return jResult;
    }
  }


  /**
    * # 获取服务器状态 
    */
  async isServerIdle(serverId) {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: true
    };
    try {
      // @ts-ignore
      let res = await ctx.model.KQSERVERINFO.findOne(
        {
          where: {
            SERVER_ID: serverId,
            SERVER_STATE: 0,
          }
        }
      );

      if (res.length === 0) {
        jResult.data = false;
      }
      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      jResult.data = false;
      return jResult;
    }
  }

  async initRedis() {
    const { app } = this;
    // 置mutex_server全部为0
    let keys = await app.redis.keys('mutex_*');
    for (let i = 0; i < keys.length; i++) {
      let curServerId = keys[i];
      await app.redis.set(curServerId, 0);
    }
    await app.redis.set(`num_running_task`, 0);
  }

  /**
   * # 置状态
   */
  async setTaskState(parentBh, taskNo, taskState) {
    const { ctx, app } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null,
    };

    // @ts-ignore
    // const transaction = await ctx.model.transaction();
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
        // transaction,
      });
      if (res.length < 1) {
        // await transaction.rollback();
        jResult.code = -1;
        jResult.msg = 'task not find';
        // await app.redis.set(`mutex_task`, 0);
        return jResult;
      }

      // 查询serverId
      res = await ctx.model.KQJOBINFO.findOne({
        where: {
          TASK_NO: taskNo,
        },
        // transaction
      })
      let serverId = res.SERVER_ID;

      // 正在执行的任务数
      let runningTask = await app.redis.get(`num_running_task`);
      let numRunningTask;
      if (undefined === runningTask || null === runningTask) {
        numRunningTask = 0;
      } else {
        numRunningTask = Number(runningTask);
      }


      switch (taskState) {
        case 1: // 数据从主服务器向分析服务器同步

          await app.redis.set(`num_running_task`, numRunningTask + 1);
          res = await app.redis.set(`mutex_${serverId}`, 1);
          // if (serverId == '2019092710145824') {

          //   let mutex = await app.redis.get(`mutex_${serverId}`);

          //    console.log(`${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}没有冲突，占用 ${mutex}`);
          // }

          // 任务时段明细表新增记录
          // @ts-ignore
          res = await ctx.model.KQJOBUNITINFO.create({
            TASK_NO: taskNo,
            SERVER_ID: serverId,
            TASK_STATE: taskState,
            FINISH_FLAG: 0,
            TASK_START: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
          },
            // transaction
          )

          // 主表置状态
          res = await ctx.model.KQJOBINFOPARENT.update({
            TASK_STATE: 1,
            TASK_START: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          }, {
            where: {
              BH: parentBh,
              TASK_START: null,
            },
            // transaction
          });

          break;

        case 6: // 结束
          await app.redis.set(`num_running_task`, numRunningTask - 1);
          await app.redis.set(`mutex_${serverId}`, 0);
          // if (serverId == '2019092710145824') {
          //   console.log(`${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}使用完毕，放回`);
          // }
          // console.log(`${serverId}置0`);
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
            // transaction,
          });


          res = await this.isFinished(parentBh);
          if (res.data) {

            // 主表置状态
            res = await ctx.model.KQJOBINFOPARENT.update({
              TASK_STATE: 2,
              TASK_END: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            }, {
              where: {
                BH: parentBh,
              },
              // transaction
            });

            await this.initRedis();
          }

          break;
        case 9: // 异常结束
          ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + '因异常强制结束:' + taskNo);

          // 主表置状态
          res = await ctx.model.KQJOBINFOPARENT.update({
            TASK_STATE: 3,
            TASK_END: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          }, {
            where: {
              BH: parentBh,
            },
            // transaction
          });

          await this.initRedis();
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
            // transaction
          });
          // @ts-ignore
          res = await ctx.model.KQJOBUNITINFO.create({
            TASK_NO: taskNo,
            SERVER_ID: serverId,
            TASK_STATE: taskState,
            TASK_START: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            FINISH_FLAG: 0,
          },
            // transaction
          );
      }
      // await transaction.commit();
      // await app.redis.set(`mutex_task`, 0);
      return jResult;
    } catch (err) {
      // await transaction.rollback();
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      jResult.data = null;
      // await app.redis.set(`mutex_task`, 0);
      return jResult;
    }
  }

  // /**
  //  * # 根据空闲的服务器找到使用该服务器的其中一个任务
  //  */
  // async getTaskNoByIdleServer() {
  //   const { ctx } = this;
  //   let jResult: IResult
  //     = {
  //     code: -1,
  //     msg: '',
  //     data: 0
  //   };
  //   // @ts-ignore
  //   try {

  //     // 任务列表中该服务器如果为等待状态置为可执行
  //     // @ts-ignore
  //     let res = await ctx.model.query(`select top 1 b.task_no,b.server_id
  //     from kq_server_info a
  //     inner join kq_job_info b on a.server_id = b.server_id
  //     where a.server_state = 0`);
  //     let task = res[0];
  //     // if(undefined !== taskNo )
  //     if (task.length > 0) {
  //       jResult.code = 0;
  //       jResult.data = task;
  //     }
  //     return jResult;
  //   } catch (err) {
  //     jResult.code = -1;
  //     jResult.msg = `${err.stack}`;
  //     ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
  //     jResult.data = null;
  //     return jResult;
  //   }
  // }



  // /**
  //  * # 置服务器为空闲状态,并将等待该服务器的其中一个任务置为可执行0
  //  */
  // async set2IdleState(serverId) {
  //   const { ctx } = this;
  //   let jResult: IResult
  //     = {
  //     code: 0,
  //     msg: '',
  //     data: 0
  //   };
  //   // @ts-ignore
  //   const transaction = await ctx.model.transaction();
  //   try {

  //     // 任务列表中该服务器如果为等待状态置为可执行
  //     let res = await ctx.model.KQJOBINFO.findOne({
  //       where: {
  //         SERVER_ID: serverId,
  //         TASK_STATE: 8,
  //       }
  //     })
  //     if (undefined !== res && null !== res) {
  //       // @ts-ignore
  //       ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + '等待转空闲,任务号:' + res.TASK_NO);
  //       await ctx.model.KQJOBINFO.update({
  //         TASK_STATE: 0,
  //       }, {
  //         where: {
  //           // @ts-ignore
  //           TASK_NO: res.TASK_NO,
  //         },
  //       });
  //     } else {

  //       // 服务器置回空闲状态
  //       res = await ctx.model.KQSERVERINFO.update({
  //         SERVER_STATE: 0,
  //       }, {
  //         where: {
  //           SERVER_ID: serverId,
  //         },
  //       });
  //       // // 一直未分配服务器的任务
  //       // res = await this.getTaskNoByIdleServer();
  //       // if (res.code === 0) {
  //       //   await ctx.model.KQJOBINFO.update({
  //       //     TASK_STATE: 0,
  //       //   }, {
  //       //     where: {
  //       //       TASK_NO: res.task_no,
  //       //     },
  //       //   });

  //       //   // 服务器置回空闲状态
  //       //   await ctx.model.KQSERVERINFO.update({
  //       //     SERVER_STATE: 1,
  //       //   }, {
  //       //     where: {
  //       //       SERVER_ID: res.server_id,
  //       //     },
  //       //   });

  //       // } else {
  //       //   // 服务器置回空闲状态
  //       //   res = await ctx.model.KQSERVERINFO.update({
  //       //     SERVER_STATE: 0,
  //       //   }, {
  //       //     where: {
  //       //       SERVER_ID: serverId,
  //       //     },
  //       //   });
  //       // }
  //     }
  //     await transaction.commit();
  //     return jResult;
  //   } catch (err) {
  //     await transaction.rollback();
  //     jResult.code = -1;
  //     jResult.msg = `${err.stack}`;
  //     ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
  //     jResult.data = null;
  //     return jResult;
  //   }
  // }



  /**
   * # 判断任务是否超时
   */
  async judgeTaskTimeout(parentBh, taskNo, taskState, timeOut) {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: 0
    };

    try {

      let nowTime = new Date().getTime();
      // 暂时关闭
      // let res = await ctx.model.KQJOBUNITINFO.findOne({
      //   attributes: ['TASK_START'],
      //   where: {
      //     TASK_NO: taskNo,
      //     TASK_STATE: taskState,
      //     FINISH_FLAG: 0,
      //   }
      // });

      let res = await ctx.model.KQJOBINFO.findOne({
        attributes: ['TASK_START'],
        where: {
          TASK_NO: taskNo,
          TASK_STATE: taskState,
        }
      });

      let startTime = nowTime;
      if (undefined !== res && null !== res) {
        startTime = new Date(res.TASK_START).getTime();
      };

      let interval = nowTime - startTime;
      if (interval > timeOut) {
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
        jResult = await ctx.service.serviceTask.setTaskState(parentBh, taskNo, taskState - 1);
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

