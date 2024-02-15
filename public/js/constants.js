let constants = {
    MESSAGE_TYPE_REQUEST: 0,
    MESSAGE_TYPE_RESPONSE: 1,
    MESSAGE_TYPE_BROADCAST: 2,
    MESSAGE_TYPE_OTHER: 3,
    MESSAGE_TYPE_ERROR: -1,

    SOURCE_SBP: 0,
    SOURCE_MASERMIC:1,
    SOURCE_SERVER: 2
};

module.exports = Object.freeze(constants); 

