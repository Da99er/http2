const fs = require('fs');
const path = require('path');

const { PATH_TO_WORKS } = global.MY1_GLOBAL;

const files = fs.readdirSync(PATH_TO_WORKS);

files
    .filter((e) => e !== 'index.js')
    .map((e) => require(path.join(PATH_TO_WORKS, e)));
