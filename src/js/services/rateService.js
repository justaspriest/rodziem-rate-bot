const Constants = require("../constants");
const { RateFlowFacade } = require("../utils/rateFlowFacade");
const { loadMedia } = require("./mediaService");
const RateFlowRepository = require('../repositories/rateFlowRepository');

const isApprovalQueueLimitReached = async (userId) => {
    return await RateFlowRepository.getUserFlowCount(userId) > 5;
};

const mapUserInfoToRateFlow = (userInfo) => {
    const rateFlowUser = {
        id: userInfo.id,
        firstName: userInfo.first_name,
        lastName: userInfo.last_name,
        userName: userInfo.username,
    };

    return {
        user: rateFlowUser,
        step: 0
    };
};

const mapCategoryActionToCategory = async (action) => {
    if (action === Constants.ACTION_ADD_CITY_RATE) {
        return 'CITY';
    } else if (action === Constants.ACTION_ADD_PLACE_RATE) {
        return 'PLACE';
    }

    throw new Error(`Неизвестная категория ${selectedAction}`);
};

const initProcess = async (userInfo) => {
    const rateFlowInitial = mapUserInfoToRateFlow(userInfo);
    rateFlowInitial.step += 1;

    await RateFlowRepository.save(rateFlowInitial);

    return {
        text: 'Начинаем новую оценку.\nВведите название для места'
    };
};

const addCategory = async (rateFlowFacade, context) => {
    const action = context.action;
    const category = mapCategoryActionToCategory(action);
    rateFlowFacade.setCategory(category);
};

const addRateValue = (rateCategory, rateFlowFacade, context) => {
    const rateRawValue = context.text;
    const rateValue = Number(rateRawValue);
    if (!rateValue || (rateValue < 1 || rateValue > 10)) {
        throw new Error(`Неправильно введена оценка. Попробуйте еще раз!`);
    }

    rateFlowFacade.addRate(rateCategory, rateValue);
};

const addDetails = async (rateFlowFacade, context) => {
    const media = !!context.media && await Promise.all(context.media.map((mediaId) => loadMedia(mediaId, context.value)));

    const detailsObj = {
        text: context.text,
        media
    };
    rateFlowFacade.setDetails(detailsObj);
}

const continueProcess = async (rateFlow, context) => {
    const responseObj = {};

    const rateFlowFacade = new RateFlowFacade(rateFlow);

    switch (rateFlow.step) {
        case 1:
            const name = context.text;
            rateFlowFacade.setName(name);

            responseObj.text = 'Выберите категорию для места';
            responseObj.options = [
                {
                    title: 'Город',
                    action: Constants.ACTION_ADD_CITY_RATE
                },
                {
                    title: 'Место',
                    action: Constants.ACTION_ADD_PLACE_RATE
                }
            ];
            break;
        case 2:
            await addCategory(rateFlowFacade, context);
            responseObj.text = 'Пожалуйста оцените место.\nНапоминаю, что оценка происходит по трем параметрам: вкус, структура и атмосфера по шкале от 1 до 10.\nОцените вкус';
            break;
        case 3:
            addRateValue(Constants.RateType.FLAVOR, rateFlowFacade, context);
            responseObj.text = 'Оцените структуру по шкале от 1 до 10';
            break;
        case 4:
            addRateValue(Constants.RateType.STRUCTURE, rateFlowFacade, context);
            responseObj.text = 'Оцените атмосферу по шкале от 1 до 10';
            break;
        case 5:
            addRateValue(Constants.RateType.ATMOSPHERE, rateFlowFacade, context);
            responseObj.text = 'Добавьте детали и/или фотографии, если хотите';
            break;
        case 6:
            await addDetails(rateFlowFacade, context);
            responseObj.text = 'Ваша оценка принята! После прохождения модерации она будет учтена в общей статистике.';
            break;
    }

    rateFlowFacade.nextStep();

    await RateFlowRepository.save(rateFlow);

    return responseObj;
};

const continueRateProcess = async (context) => {
    const userInfo = context.user;
    if (await isApprovalQueueLimitReached(userInfo.id)) {
        throw new Error('Достигнут лимит оценок, ожидайте подтверждения оставленных оценок');
    }

    const rateFlow = await RateFlowRepository.getCurrentByUserId(userInfo.id);
    if (rateFlow == null) {
        return initProcess(userInfo);
    }

    return continueProcess(rateFlow, context);
};

module.exports.continueRateProcess = continueRateProcess;
