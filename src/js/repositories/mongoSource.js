const { MongoClient } = require('mongodb');

const { configuration } = require('../utils/configuration');

const withCollection = async (collectionName, collectionHandler) => {
    const client = new MongoClient(configuration.databaseUrl);

    return client.connect()
        .then(() => {
            const db = client.db(configuration.databaseName);
            return db.collection(collectionName);
        })
        .then(collectionHandler)
        .finally(() => client.close());
};

module.exports.withCollection = withCollection;