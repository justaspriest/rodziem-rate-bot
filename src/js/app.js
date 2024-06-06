const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

const Constants = require('./constants');
const { routeMessage } = require('./routers/messageRouter');
const { handleStartCommand, handleHelpCommand } = require('./controllers/commandController');
const { routeCallback } = require('./routers/callbackRouter');
const { handlePhotoMessage } = require('./routers/photoRouter');
const { configuration } = require('./utils/configuration');

const bot = new Telegraf(configuration.token);

// bot.use(Telegraf.log());

bot.telegram.setMyCommands(Constants.COMMANDS);
bot.start(handleStartCommand);
bot.help(handleHelpCommand);

bot.on(message(Constants.ResponseFilter.TEXT), routeMessage);
bot.on(message(Constants.ResponseFilter.PHOTO), handlePhotoMessage);
bot.on(Constants.ResponseFilter.CALLBACK, routeCallback);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
