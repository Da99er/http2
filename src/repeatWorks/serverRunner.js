const http = require('http');
const { join } = require('path');

const {
    PORT,
    ROOTDIR,
    DOMAIN_NAME,
    emitter,
    EVENT_SERVER_IS_RUNNING,
} = global.MY1_GLOBAL;

const serverRouter = require(join(ROOTDIR, 'router'));

http.createServer(serverRouter()).listen(PORT, '127.0.0.1', () => {

    emitter.emit(EVENT_SERVER_IS_RUNNING, new Date());

});

emitter.on(EVENT_SERVER_IS_RUNNING, (date) => {

    console.info(`${date} ${DOMAIN_NAME}:${PORT}`); // eslint-disable-line no-console

});