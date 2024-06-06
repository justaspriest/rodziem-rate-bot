const { continueRateProcess } = require('../services/rateService');
const { handleResponseObject } = require('../utils/responseUtils');

const handleRateProcess = async (context) => {
    try {
        const responseObj = await continueRateProcess(context);
        await handleResponseObject(responseObj, context);
    } catch (e) {
        console.error(e);
        await context.reply(`Ошибка: ${e}`);
    }
};

const getRateSummary = async (context) => {
    await context.reply('Общая статистика:');
};

module.exports.handleRateProcess = handleRateProcess;
module.exports.getRateSummary = getRateSummary;
