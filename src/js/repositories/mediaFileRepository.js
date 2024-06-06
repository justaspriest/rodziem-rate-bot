const { withCollection } = require('./mongoSource');

const COLLECTION_RATE_FLOW = 'mediaFile';

const withFlowCollection = (operation) => withCollection(COLLECTION_RATE_FLOW, operation);

const save = async (mediaFile) => {
    const operation = (collection) => collection.insertOne(mediaFile);
    return withFlowCollection(operation);
};

module.exports.save = save;
