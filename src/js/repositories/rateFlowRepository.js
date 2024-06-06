const { withCollection } = require('./mongoSource');

const COLLECTION_RATE_FLOW = 'rateFlow';
const FILTER_USER_ID = 'user.id';

const withFlowCollection = (operation) => withCollection(COLLECTION_RATE_FLOW, operation);

const save = async (rateFlow) => {
    const operation = (collection) => {
        const { _id: entityId, ...updateModel } = rateFlow;

        if (!entityId) {
            return collection.insertOne(updateModel);
        }

        const query = { _id: entityId };
        const updateOperation = {
            $set: updateModel
        };
        const options = { upsert: true };

        return collection.updateOne(query, updateOperation, options);
    };
    return withFlowCollection(operation);
};

const getCurrentByUserId = async (userId) => {
    const operation = (collection) => {
        const findOptions = {
            [FILTER_USER_ID]: userId,
            step: {
                $lte: 6,
            },
        };
        return collection.findOne(findOptions);
    };

    return withFlowCollection(operation);
};

const getUserFlowCount = async (userId) => {
    const operation = (collection) => {
        const query = { [FILTER_USER_ID]: userId };
        return collection.countDocuments(query);
    };

    return withFlowCollection(operation);
};

module.exports.save = save;
module.exports.getCurrentByUserId = getCurrentByUserId;
module.exports.getUserFlowCount = getUserFlowCount;
