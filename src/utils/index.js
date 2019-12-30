const fs = require('fs');
const {join} = require('path');

const { PATH_TO_SERVER_HELPERS } = global.MY1_GLOBAL;

const files = fs.readdirSync(PATH_TO_SERVER_HELPERS);

const utils = {};

files
    .filter((helper) => helper !== 'index.js')
    .map((helper) => require(join(PATH_TO_SERVER_HELPERS, helper))); // eslint-disable-line global-require

module.exports = utils;
