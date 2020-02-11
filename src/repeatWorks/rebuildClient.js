const { join } = require('path');
const fs = require('fs');

const { PATH_TO_BUNDLE } = require(join(__dirname, '..', 'globals', 'path-to'));

let prevBuildHash = '';

const rebuildClient = () => {

    fs.readdir(PATH_TO_BUNDLE, (errorReadDir, files) => {

        if (errorReadDir) {

            throw errorReadDir;

        }

        if (files.length && (prevBuildHash !== files.join(''))) {

            prevBuildHash = files.join('');

            const fileMap = {};

            files.forEach((file) => {

                const fileKey = file.split('.').slice(-2).join('.');

                fileMap[fileKey] = file;

            });

            global.MY1_GLOBAL.RELOAD_FILES_STORAGE = fileMap;

        }

    });

};

rebuildClient();

fs.watch(PATH_TO_BUNDLE, (
    // eventType, filename
) => {

    rebuildClient();

});
