const { join } = require('path');
const fs = require('fs');

const { PATH_TO_BUNDLE } = require(join(__dirname, '..', '..', 'globals', 'pathTo'));
const { FILE_STORAGE_RELOADED } = require(join(__dirname, '..', '..', 'globals', 'events'));

let prevBuildHash = '';

function rebuildClient() {

    const {
        RELOAD_FILES_STORAGE,
        emitter,
    } = global.MY1_GLOBAL;

    fs.readdir(PATH_TO_BUNDLE, (errorReadDir, files) => {

        if (errorReadDir) {

            throw errorReadDir;

        }

        if (files.length && (prevBuildHash !== files.join(''))) {

            prevBuildHash = files.join('');

            Object.values(RELOAD_FILES_STORAGE).forEach((file) => {

                delete require.cache[file];

            });

            const fileMap = {};

            files.forEach((file) => {

                const fileKey = file.split('.').slice(-2).join('.');

                fileMap[fileKey] = join(PATH_TO_BUNDLE, file);

            });

            global.MY1_GLOBAL.RELOAD_FILES_STORAGE = fileMap;

            emitter.emit(FILE_STORAGE_RELOADED, fileMap);

        }

    });

}

rebuildClient();

fs.watch(PATH_TO_BUNDLE, (
    // eventType, filename
) => {

    rebuildClient();

});
