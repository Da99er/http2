const { join } = require('path');
const fs = require('fs');

const {
    PATH_TO_BUNDLE,
    RELOAD_FILES_STORAGE,
} = global.MY1_GLOBAL;

let prevBuildHash = '';

const rebuildClient = () => {

    fs.readdir(PATH_TO_BUNDLE, (errorReadDir, files) => {

        if (errorReadDir) {

            throw errorReadDir;

        }

        if (files.length && (prevBuildHash !== files.join(''))) {

            prevBuildHash = files.join('');

            Object.keys(RELOAD_FILES_STORAGE).forEach((file) => {

                const filePath = join(PATH_TO_BUNDLE, RELOAD_FILES_STORAGE[file]);

                delete require.cache[filePath];
                delete RELOAD_FILES_STORAGE[file];

            });

            files.forEach((file) => {

                const fileKey = file.split('.').slice(-2).join('.');

                RELOAD_FILES_STORAGE[fileKey] = file;

            });

        }

    });

};

rebuildClient();

fs.watch(PATH_TO_BUNDLE, (
    // eventType, filename
) => {

    rebuildClient();

});
