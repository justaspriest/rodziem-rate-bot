const { continueRateProcess } = require("../services/rateService");
const { handleResponseObject } = require("../utils/responseUtils");

const handleMediaMessage = async (context) => {
    try {
        const responseObj = await continueRateProcess(context);
        await handleResponseObject(responseObj, context);
    } catch (e) {
        console.error(e);
        await context.reply(`Ошибка: ${e}`);
    }
};

module.exports.handleMediaMessage = handleMediaMessage;
