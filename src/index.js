const { join } = require('path');

global.MY1_GLOBAL = require(join(__dirname, 'globals', 'server'));

// some problem with SSL and HTTPS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const {
    PATH_TO_UTILS,
    PATH_TO_SERVICES,
    PATH_TO_APIV1,
} = require(join(__dirname, 'globals', 'pathTo'));

require(join(PATH_TO_UTILS, 'colors'));
require(PATH_TO_SERVICES);
require(PATH_TO_APIV1);

process.on('uncaughtException', (error) => {

    console.trace(error); // eslint-disable-line no-console

});
