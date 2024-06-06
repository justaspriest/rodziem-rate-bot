const { continueRateProcess } = require('../services/rateService');
const { handleResponseObject } = require('../utils/responseUtils');

const handleMessage = async (ctx) => {
    try {
        const responseObj = await continueRateProcess(ctx);
        await handleResponseObject(responseObj, ctx);
    } catch (e) {
        console.error(e);
        await ctx.reply(`Ошибка: ${e}`);
    }
};

module.exports.handleCommonMessage = handleMessage;
