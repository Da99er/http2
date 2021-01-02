const fs = require('fs');
const { join } = require('path');

const { PATH_TO_SERVICES } = require(join(__dirname, '..', 'globals', 'pathTo'));

const files = fs.readdirSync(PATH_TO_SERVICES);

files
    .filter((e) => e !== 'index.js')
    .forEach((e) => require(join(PATH_TO_SERVICES, e)));
