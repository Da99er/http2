const { join } = require('path');
const fs = require('fs');

const { PATH_TO_BUNDLE } = require(join(__dirname, '..', 'globals', 'path-to'));

let prevBuildHash = '';

const rebuildClient = () => {

    const {RELOAD_FILES_STORAGE} = global.MY1_GLOBAL;

    fs.readdir(PATH_TO_BUNDLE, (errorReadDir, files) => {

        if (errorReadDir) {

            throw errorReadDir;

        }

        if (files.length && (prevBuildHash !== files.join(''))) {

            prevBuildHash = files.join('');

            Object.keys(RELOAD_FILES_STORAGE).forEach((file) => {

                const filePath = join(PATH_TO_BUNDLE, RELOAD_FILES_STORAGE[file]);

                delete require.cache[filePath];

            });

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
