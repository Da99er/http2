const path = require('path');

global.IS_SERVER = true;
global.window = {
    IS_SERVER: global.IS_SERVER,
    MODE: process.env.MODE || 'development',
    addEventListener() {}, // eslint-disable-line no-empty-function
};
/*
https://github.com/facebook/create-react-app/issues/3199
We'll figure something out soon. Sorry about that. This was the biggest release we ever did, there's also a new website we're launching today, and between all that there's a few kinks we still need to iron out.
*/
global.requestAnimationFrame = function(callback) {

    setTimeout(callback, 0);

};

// some problem with SSL and HTTPS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const {
    SERVER_HELPERS,
    PATH_TO_WORKS,
    PATH_TO_APIV1,
} = global.MY1_GLOBAL = require(path.join(__dirname, 'globals', 'index'));

require(SERVER_HELPERS);
require(PATH_TO_WORKS);
require(PATH_TO_APIV1);

process.on('uncaughtException', (error) => {

    console.trace(error); // eslint-disable-line no-console

});
