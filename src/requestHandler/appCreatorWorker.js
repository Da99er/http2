const EventEmitter = require('events');
const emitter = new EventEmitter();

const workerCreator = require('./workerCreator');
const workerTimeOut = require('./workerTimeOut');

const workerStore = {
    worker: workerCreator(emitter),
    isRamStartClear: false,
};

const sevenSec = 7000;

const appCreatorWorker = ({ serverFile, preloadData, url }) => new Promise((resolve, reject) => {

    const startTimeKey = Date.now();

    workerStore.worker.postMessage({
        timeKey: startTimeKey,
        serverFile,
        preloadData,
        url,
    });

    const workerCallback = ({ timeKey, result, error }) => {

        if (startTimeKey === timeKey) {

            emitter.removeListener(timeKey, workerCallback);
            error ? reject(error) : resolve(result);

        }

        if (workerStore.isRamStartClear === false) {

            workerStore.isRamStartClear = true;
            setTimeout((worker) => {

                workerStore.isRamStartClear = false;
                worker.postMessage({ timeKey: 0, serverFile });

            }, sevenSec, workerStore.worker);
            workerStore.worker = workerCreator(emitter, serverFile);
            workerStore.worker.postMessage({ serverFile });

        }

    };

    emitter.addListener(startTimeKey, workerCallback);

    setTimeout(workerTimeOut, sevenSec, { emitter, startTimeKey, workerCallback, reject });

});

module.exports = appCreatorWorker;
