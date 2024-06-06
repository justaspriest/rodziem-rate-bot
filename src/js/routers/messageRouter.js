const Constants = require('../constants');
const { handleCommonMessage } = require('../controllers/messageController');
const { getRateSummary, handleRateProcess } = require('../controllers/rateController');
const { wrapContext } = require('../utils/contextUtils');

const createContext = (ctx) => {
    const text = !!ctx.message && ctx.message.text;
    const command = !!text && text.substring(1);

    return {
        ...wrapContext(ctx),
        text,
        command
    };
};

const handleMessage = async (ctx) => {
    const context = createContext(ctx);
    const isCommand = isCommandContext(ctx);

    if (isCommand) {
        await handleCommonCommand(context);
    } else {
        await handleCommonMessage(context);
    }
};

const isCommandContext = (ctx) => {
    if (!ctx || !ctx.message) {
        return false;
    }

    const entities = ctx.message.entities;

    return !!entities && !!entities[0] && entities[0].type === 'bot_command';
}

const handleCommonCommand = async (context) => {
    const command = context.command;

    if (command === Constants.COMMAND_SHOW_RATE) {
        await getRateSummary(context);
    } else if (command === Constants.COMMAND_ADD_RATE) {
        await handleRateProcess(context);
    } else {
        await context.reply('Команда не распознана!');
    }
};

module.exports.routeMessage = handleMessage;
