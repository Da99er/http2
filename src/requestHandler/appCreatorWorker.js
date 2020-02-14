const EventEmitter = require('events');
const emitter = new EventEmitter();

const workerCreator = require('./workerCreator');
const workerTimeOut = require('./workerTimeOut');

const workerStore = {
    worker: null,
    isRamStartClear: false,
};

const sevenSec = 7000;

const appCreatorWorker = ({ serverFile, preloadData, url }) => new Promise((resolve, reject) => {

    const startTimeKey = Date.now();

    if (workerStore.worker) {

        workerStore.worker.postMessage({
            timeKey: startTimeKey,
            preloadData,
            url,
        });

    } else {

        workerStore.worker = workerCreator(emitter, serverFile);
        resolve(null);

    }

    const workerCallback = ({ timeKey, result, error }) => {

        if (startTimeKey === timeKey) {

            emitter.removeListener(timeKey, workerCallback);

            if (error) {

                workerStore.worker = null;
                reject(error);

            }

            resolve(result);

        }

        if (workerStore.isRamStartClear === false) {

            workerStore.isRamStartClear = true;
            setTimeout((worker) => {

                workerStore.isRamStartClear = false;
                worker.postMessage({ timeKey: 0 });

            }, sevenSec, workerStore.worker);

            workerStore.worker = workerCreator(emitter, serverFile);
            workerStore.worker.postMessage({});

        }

    };

    emitter.addListener(startTimeKey, workerCallback);

    setTimeout(workerTimeOut, sevenSec, { emitter, startTimeKey, workerCallback, reject });

});

module.exports = appCreatorWorker;
