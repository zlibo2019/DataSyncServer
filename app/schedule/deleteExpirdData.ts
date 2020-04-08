exports.schedule = {
    type: 'worker',
    // cron: '0 0 3 * * *',
    interval: '86400s',  //'86400s',
    // immediate: true,
};

exports.task = async function (ctx) {
    await ctx.service.serviceMain.deleteExpirdData();
};