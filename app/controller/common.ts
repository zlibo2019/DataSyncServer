'use strict';


import { Controller } from 'egg';
import { IResult } from '../extend/helper';
import moment = require('moment');

/**
 * 分析结束置状态
 */
class CommonController extends Controller {
    async create() {
        const { ctx } = this;
        let body = ctx.request.body;
        let jResult: IResult
            = {
            code: 0,
            msg: '',
            data: null,
        };

        try {
            // let taskNo = body.task_no;
            let arr = Object.keys(body);
            let curBody = arr[0];
            let taskNo = curBody.replace(`"task_no":`, ``).replace(`"`, ``).replace(`"`, ``);
            jResult = await ctx.service.serviceTask.getTaskInfo(taskNo);
            if (jResult.code === -1) {
                ctx.failed(jResult);
                ctx.logger.error(jResult.msg);
                return;
            }
            let res = jResult.data;
            let curTaskState = Number(res.TASK_STATE);
            if (curTaskState !== 3) {
                jResult.msg = '状态已被更改,该分析结果状态更新无效!';
                jResult = await ctx.service.serviceTask.setTaskState(res.PARENT_BH, taskNo, 9);
                await ctx.service.serviceTask.setError(taskNo, jResult.msg);
                ctx.logger.error(jResult.msg);
                ctx.failed(jResult);
                return;
            }
            ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ' 分析完成!' + JSON.stringify(body));
            // @ts-ignore
            jResult = await ctx.service.serviceTask.setTaskState(res.PARENT_BH, taskNo, 4);

            if (jResult.code === -1) {
                ctx.failed(jResult);
                return;
            }

            ctx.success(jResult);
        } catch (err) {
            jResult.code = -1;
            jResult.msg = err.stack;
            ctx.failed(jResult);
        }
    }
}

module.exports = CommonController;
