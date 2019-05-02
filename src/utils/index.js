const fs = require('fs');
const path = require('path');

const { PATH_TO_UTILS } = global.MY1_GLOBAL;

const files = fs.readdirSync(PATH_TO_UTILS);

const utils = {};

files
    .filter((e) => e !== 'index.js')
    .map((e) => require(path.join(PATH_TO_UTILS, e))); // eslint-disable-line global-require

module.exports = utils;
