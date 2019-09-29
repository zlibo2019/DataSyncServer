import { Service } from 'egg';
// @ts-ignore
import { IResult, enumMapTableName } from '../extend/helper';
import moment = require('moment');
const FormStream = require('formstream');

export default class AnalyseService extends Service {

  /**
   * # 调用数据分析地址
   */
  async callAnalyse(parentBh, host, startDate, endDate, userData, fx, lock, depData, year, month, day,
    instanceName, dbPort, dbName, user, pwd, taskNo, urlHead
  ) {
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {

      // @ts-ignore
      jResult = await ctx.service.serviceTask.setTaskState(parentBh, taskNo, 3);   // 分析中
      if (jResult.code === -1) {
        ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
      }

      let ip = this.config.program.current_ip;
      let port = this.config.program.current_port;
      const form = new FormStream();
      form.field('year', year);
      form.field('month', month);
      form.field('DateBegin', startDate);
      form.field('DateEnd', endDate);
      form.field('begin', day);
      form.field('DepData', depData);
      form.field('UserData', userData);
      form.field('fx', fx);
      form.field('lock', lock);
      form.field('callback', `${ip}:${port}/analizeResult`);
      form.field('host', host);
      form.field('InstanceName', instanceName);
      form.field('port', dbPort);
      form.field('dbName', dbName);
      form.field('user', user);
      form.field('pwd', pwd);
      form.field('taskNo', taskNo);

      // 获取班级信息
      await ctx.curl(urlHead, {
        method: 'POST',
        headers: form.headers(),
        stream: form,
        // dataType: 'json',
      });
      return jResult;
    } catch (err) {
      await ctx.service.serviceTask.setTaskState(parentBh, taskNo, 9);
      await ctx.service.serviceTask.setError(taskNo, `分析错误:${err.stack}`);
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + '数据分析执行错误:' + err.stack);
      jResult.data = null;
      return jResult;
    }
  }
}

