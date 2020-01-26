const { parentPort } = require('worker_threads');

global.window = {
    IS_SERVER: true,
    MODE: process.env.MODE,
    addEventListener() {}, // eslint-disable-line no-empty-function
};

parentPort.on('message', ({ timeKey, serverFile, preloadData = {}, url = '/' }) => {

    try {

        const appCreator = require(serverFile).default;

        const result = appCreator(preloadData, url);

        parentPort.postMessage({ timeKey, result });

    } catch (error) {

        parentPort.postMessage({ timeKey, error });

    }

    if (timeKey === 0) {

        parentPort.unref();

    }

});
