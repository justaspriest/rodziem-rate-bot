const wrapContext = (ctx) => ({
    value: ctx,
    user: ctx.from,
    reply: (a1, a2) => ctx.reply(a1, a2)
});

module.exports.wrapContext = wrapContext;
