const { EventEmitter } = require('events');

module.exports = {
    DOMAIN_NAME: process.env.DOMAIN_NAME,
    PORT: process.env.PORT || 3000,
    RELOAD_FILES_STORAGE: {},
    APIV1: {},
    emitter: new EventEmitter(),
};
