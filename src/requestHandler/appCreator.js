const { parentPort, workerData } = require('worker_threads');

global.window = {
    IS_SERVER: true,
    MODE: process.env.MODE,
    addEventListener() {}, // eslint-disable-line no-empty-function
};

const appCreator = require(workerData).default;

parentPort.on('message', ({ timeKey, preloadData = {}, url = '/' }) => {

    try {

        const result = appCreator(preloadData, url);

        parentPort.postMessage({ timeKey, result });

    } catch (error) {

        parentPort.postMessage({ timeKey, error });
        parentPort.unref();

    }

    if (timeKey === 0) {

        parentPort.unref();

    }

});
