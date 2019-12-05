const { resolve, join } = require('path');

global.ROOTDIR = resolve(__dirname);

global.MY1_GLOBAL = require(join(global.ROOTDIR, 'globals'));

// some problem with SSL and HTTPS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const {
    PATH_TO_SERVER_HELPERS,
    PATH_TO_WORKS,
    PATH_TO_APIV1,
} = global.MY1_GLOBAL;

require(PATH_TO_SERVER_HELPERS);
require(PATH_TO_WORKS);
require(PATH_TO_APIV1);

process.on('uncaughtException', (error) => {

    console.trace(error); // eslint-disable-line no-console

});
