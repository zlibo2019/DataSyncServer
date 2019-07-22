exports.schedule = {
    type: 'worker',
    // cron: '0 0 3 * * *',
    interval: '5s',
    // immediate: true,
};

exports.task = async function (ctx) {
    await ctx.service.serviceMain.loadServerIntoRedis();
};