const fs = require('fs');
const {join} = require('path');

const { PATH_TO_UTILS } = global.MY1_GLOBAL;

const files = fs.readdirSync(PATH_TO_UTILS);

const utils = {};

files
    .filter((helper) => helper !== 'index.js')
    .map((helper) => require(join(PATH_TO_UTILS, helper))); // eslint-disable-line global-require

module.exports = utils;
