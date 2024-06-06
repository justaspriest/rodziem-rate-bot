const configuration = {
    token: process.env.TOKEN_BOT,
    databaseUrl: process.env.MONGODB_URL,
    databaseName: process.env.MONGODB_DATABASE,
    cachePath: process.env.PATH_CACHE
};

module.exports.configuration = configuration;
