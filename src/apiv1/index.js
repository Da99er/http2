const fs = require('fs');
const { join } = require('path');

const { PATH_TO_APIV1 } = require(join(__dirname, '..', 'globals', 'path-to'));

const files = fs.readdirSync(PATH_TO_APIV1);

files
    .filter((e) => e !== 'index.js')
    .map((e) => require(join(PATH_TO_APIV1, e))); // rm .js on the end of the string
