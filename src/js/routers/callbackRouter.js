const { handleRateProcess } = require("../controllers/rateController");
const { wrapContext } = require("../utils/contextUtils");

const createContext = (ctx) => {
    const action = !!ctx.callbackQuery && ctx.callbackQuery.data;

    return {
        ...wrapContext(ctx),
        action
    };
};

const handle = async (ctx) => {
    const context = createContext(ctx);

    await handleRateProcess(context);
};

module.exports.routeCallback = handle;
