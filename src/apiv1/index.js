const fs = require('fs');
const path = require('path');

const { PATH_TO_APIV1 } = global.MY1_GLOBAL;

const files = fs.readdirSync(PATH_TO_APIV1);

files
    .filter((e) => e !== 'index.js')
    .map((e) => require(path.join(PATH_TO_APIV1, e))); // rm .js on the end of the string
