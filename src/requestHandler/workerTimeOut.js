const workerTimeOut = ({ emitter, startTimeKey, workerCallback, reject }) => {

    emitter.removeListener(startTimeKey, workerCallback);
    reject('Time out');

};

module.exports = workerTimeOut;
