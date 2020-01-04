const fs = require('fs');
const { join } = require('path');

const { PATH_TO_WORKS } = require(join(__dirname, '..', 'globals', 'path-to'));

const files = fs.readdirSync(PATH_TO_WORKS);

files
    .filter((e) => e !== 'index.js')
    .map((e) => require(join(PATH_TO_WORKS, e)));
