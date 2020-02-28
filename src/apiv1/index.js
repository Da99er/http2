const fs = require('fs');
const { join } = require('path');

const { PATH_TO_APIV1 } = require(join(__dirname, '..', 'globals', 'pathTo'));

const { APIV1 } = global.MY1_GLOBAL;

const files = fs.readdirSync(PATH_TO_APIV1);

files
    .filter((loader) => loader !== 'index.js')
    .forEach((loader) => {

        const loaderName = loader.split('.')[0];

        APIV1[loaderName] = require(join(PATH_TO_APIV1, loader));

    });
