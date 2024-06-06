const COMMAND_ADD_RATE = 'add_rate';
const COMMAND_SHOW_RATE = 'read_rate';

const COMMANDS = [
    {
        command: COMMAND_SHOW_RATE,
        description: 'Посмотреть оценки'
    },
    {
        command: COMMAND_ADD_RATE,
        description: 'Добавить оценку'
    }
];

const ACTION_ADD_CITY_RATE = 'add_city_rate';
const ACTION_ADD_PLACE_RATE = 'add_place_rate';

const ResponseFilter = {
    TEXT: 'text',
    CALLBACK: 'callback_query',
    PHOTO: 'photo'
}

const RateType = {
    FLAVOR: 'FLAVOR',
    STRUCTURE: 'STRUCTURE',
    ATMOSPHERE: 'ATMOSPHERE'
}

module.exports.COMMAND_ADD_RATE = COMMAND_ADD_RATE;
module.exports.COMMAND_SHOW_RATE = COMMAND_SHOW_RATE;
module.exports.COMMANDS = COMMANDS;
module.exports.ACTION_ADD_CITY_RATE = ACTION_ADD_CITY_RATE;
module.exports.ACTION_ADD_PLACE_RATE = ACTION_ADD_PLACE_RATE;
module.exports.ResponseFilter = ResponseFilter;
module.exports.RateType = RateType;
