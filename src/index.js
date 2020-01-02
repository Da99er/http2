const { resolve, join } = require('path');
const { EventEmitter } = require('events');

global.ROOTDIR = resolve(__dirname);
global.MY1_GLOBAL = require(join(global.ROOTDIR, 'globals'));
global.MY1_GLOBAL.emitter = new EventEmitter();

// some problem with SSL and HTTPS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const {
    PATH_TO_UTILS,
    PATH_TO_WORKS,
    PATH_TO_APIV1,
} = global.MY1_GLOBAL;

require(PATH_TO_UTILS);
require(PATH_TO_WORKS);
require(PATH_TO_APIV1);

process.on('uncaughtException', (error) => {

    console.trace(error); // eslint-disable-line no-console

});
