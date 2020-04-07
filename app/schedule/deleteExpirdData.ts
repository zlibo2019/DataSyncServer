exports.schedule = {
    type: 'worker',
    // cron: '0 0 3 * * *',
    interval: '172800s',  //'172800s',
    // immediate: true,
};

exports.task = async function (ctx) {
    await ctx.service.serviceMain.deleteExpirdData();
};