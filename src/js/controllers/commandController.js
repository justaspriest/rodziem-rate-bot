const handleStartCommand = async (ctx) => {
    await ctx.reply('Привет!');
};

const handleHelpCommand = async (ctx) => {
    await ctx.reply('Send me a sticker');
};

module.exports.handleStartCommand = handleStartCommand;
module.exports.handleHelpCommand = handleHelpCommand;
