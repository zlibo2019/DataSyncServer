import { Service } from 'egg';
// @ts-ignore
import { IResult, enumMapTableName } from '../extend/helper';
import moment = require('moment');

export default class CommonService extends Service {

  /**
   * # 根据部门查人员
   */

  async getUserByDep(depData) {
    // @ts-ignore
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {
      let arrDep = depData.split(',');
      let arrs = await ctx.model.DtUser.findAll({
        attributes: ['user_serial'],
        where: {
          user_dep: {
            $in: arrDep,
          }
        }
      });
      let arr = await arrs.map(i => i.get({ plain: true }));

      jResult.data = arr;

      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
      jResult.data = null;
      return jResult;
    }
  }


  /**
   * # 根据serverId查服务器信息
   */

  async getServerByServerId(id) {
    // @ts-ignore
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {
      let server = await ctx.model.KQSERVERINFO.findOne({
        where: {
          SERVER_ID: id,
        }
      });
      jResult.data = server;
      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
      jResult.data = null;
      return jResult;
    }
  }

  // 驼峰转换下划线
  toLine(name) {
    let leftName = name.slice(0, 1);
    let rightName = name.slice(1);
    return leftName.toLowerCase() + rightName.replace(/([A-Z])/g, "_$1").toLowerCase();
  }

  /**
   * # 格式化查询条件,将变量替换为值 
   */
  // @ts-ignore
  formatCondition(depData, userData, startDate, endDate, year, month, condition, offset) {
    // @ts-ignore
    const { ctx } = this;
    let jResult: IResult
      = {
      code: 0,
      msg: '',
      data: null
    };
    try {
      let sCondition = JSON.stringify(condition);

      let yearMonth = `${year}-${month}`;
      let beginMonth = moment(yearMonth).add(-1, 'month').format('YYYY-MM');
      let endMonth = moment(yearMonth).add(1, 'month').format('YYYY-MM');
      startDate = moment(startDate).add(offset * -2, 'day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment(endDate).add(offset * 2+1, 'day').format('YYYY-MM-DD HH:mm:ss');
      sCondition = sCondition.replace('@dep', `${depData}`)
        .replace('@user', userData).replace(`["`, `[`).replace(`"]`, `]`)
        .replace('@begin_date', startDate)
        .replace('@end_date', endDate)
        .replace('@begin_month', beginMonth)
        .replace('@end_month', endMonth);
      jResult.data = JSON.parse(sCondition);
      return jResult;
    } catch (err) {
      jResult.code = -1;
      jResult.msg = `${err.stack}`;
      ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.msg);
      jResult.data = null;
      return jResult;
    }
  }

  /**
   * # 数组中是否有重复值,有为true
   */
  checkDuplicationNormal<T>(arr: T[]) {
    return arr.some((val, idx) => {
      return arr.includes(val, idx + 1);
    });
  }
}

