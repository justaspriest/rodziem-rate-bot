const { Markup } = require('telegraf');

const handleResponseObject = async (responseObj, context) => {
    const { text, options } = responseObj;

    if (!options) {
        await context.reply(text);
        return;
    }

    const buttons = options.map((option) => Markup.button.callback(option.title, option.action));
    const messageOptions = Markup.inlineKeyboard(buttons);

    await context.reply(text, messageOptions);
};

module.exports.handleResponseObject = handleResponseObject;
