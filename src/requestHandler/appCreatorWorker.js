const { join } = require('path');
const EventEmitter = require('events');
const workerEmitter = new EventEmitter();

const { emitter } = global.MY1_GLOBAL;

const workerCreator = require('./workerCreator');

const { FILE_STORAGE_RELOADED } = require(join(__dirname, '..', 'globals', 'events'));

const workerStore = {
    worker: null,
    isRamStartClear: false,
};

const sevenSec = 7000;

function appCreatorWorker({
    serverFile,
    fileStorage,
    preloadData,
    preloadQuery,
    location,
}) {

    return new Promise((resolve, reject) => {

        const startTimeKey = Date.now();

        if (workerStore.worker && workerStore.worker.threadId > 0) {

            workerStore.worker.postMessage({
                timeKey: startTimeKey,
                fileStorage,
                preloadData,
                preloadQuery,
                location,
            });

        } else {

            workerStore.worker = workerCreator(workerEmitter, serverFile);
            resolve(null);

        }

        function workerCallback({ timeKey, result, error }) {

            if (error) {

                reject(error);

            }

            if (startTimeKey === timeKey) {

                workerEmitter.removeListener(timeKey, workerCallback);

                resolve(result);

            }

        }

        if (workerStore.isRamStartClear === false) {

            workerStore.isRamStartClear = true;
            setTimeout((worker) => {

                workerStore.isRamStartClear = false;
                worker.postMessage({ timeKey: 0 });

            }, sevenSec, workerStore.worker);

            workerStore.worker = workerCreator(workerEmitter, serverFile);

        }

        workerEmitter.addListener(startTimeKey, workerCallback);

    });

}

emitter.on(FILE_STORAGE_RELOADED, (fileStorage) => {

    if (workerStore.worker === null) {

        const PATH_TO_SERVER = fileStorage['server.js'];

        workerStore.worker = workerCreator(workerEmitter, PATH_TO_SERVER);

    }

});

module.exports = appCreatorWorker;
