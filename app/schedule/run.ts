import moment = require('moment');
exports.schedule = {
    type: 'worker',
    // cron: '0 0 3 * * *',
    // interval: '10s',
    immediate: true,
};


// 执行任务
function _runTask(ctx) {
    const interval = 4000;
    setTimeout(async () => {
        let jResult = await ctx.service.serviceMain.runTask();
        if (jResult.code === -1) {
            ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.message);
        }
        _runTask(ctx);
    }, interval);
};

exports.task = async function (ctx) {
    // await ctx.service.serviceTask.initRedis();
    await ctx.service.serviceTask.flushRedis();
    await ctx.service.serviceMain.loadServerIntoRedis();
    _runTask(ctx);
};

// exports.schedule = {
//     type: 'all',
//     // cron: '0 0 3 * * *',
//     interval: '10s',
//     // immediate: true,
// };

// exports.task = async function (ctx) {
//     let jResult = await ctx.service.serviceCommon.runTask();
//     if (jResult.code === -1) {
//         ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.message);
//     }
// };