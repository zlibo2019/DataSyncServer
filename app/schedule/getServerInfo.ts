exports.schedule = {
    type: 'all',
    // cron: '0 0 3 * * *',
    interval: '1s',
    // immediate: true,
};

exports.task = async function (ctx) {
   await ctx.service.serviceCommon.loadServerIntoRedis();
};