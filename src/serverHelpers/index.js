const fs = require('fs');
const path = require('path');

const { SERVER_HELPERS } = global.MY1_GLOBAL;

const files = fs.readdirSync(SERVER_HELPERS);

const utils = {};

files
    .filter((e) => e !== 'index.js')
    .map((e) => require(path.join(SERVER_HELPERS, e))); // eslint-disable-line global-require

module.exports = utils;
