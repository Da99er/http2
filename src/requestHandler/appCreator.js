const { parentPort, workerData } = require('worker_threads');

const appCreator = require(workerData).default;

parentPort.on('message', ({
    timeKey,
    fileStorage,
    preloadData,
    preloadQuery,
    location = {},
}) => {

    if (timeKey === 0) {

        parentPort.unref();

    }

    try {

        const result = timeKey ? appCreator({
            fileStorage,
            preloadData,
            preloadQuery,
            location,
        }) : null;

        parentPort.postMessage({ timeKey, result });

    } catch (error) {

        parentPort.postMessage({ timeKey, error });
        parentPort.unref();

    }

});
