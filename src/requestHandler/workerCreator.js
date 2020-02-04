const { join } = require('path');
const { Worker } = require('worker_threads');

const workerCreator = (emitter, serverFile) => {

    const worker = new Worker(join(__dirname, './appCreator.js'), {
        workerData: serverFile,
    });

    worker.on('message', ({ timeKey, result, error }) => {

        emitter.emit(timeKey, { timeKey, result, error });

    });

    worker.on('exit', (code) => {

        if (code) {

            throw new Error(`Worker stopped with exit code ${code}`);

        }

    });

    return worker;

};

module.exports = workerCreator;
