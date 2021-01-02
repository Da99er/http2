const http = require('http');
const { join } = require('path');

const { EVENT_SERVER_IS_RUNNING } = require(join(__dirname, '..', '..', 'globals', 'events'));

const { PATH_TO_HANDLER } = require(join(__dirname, '..', '..', 'globals', 'pathTo'));
const handleRequest = require(PATH_TO_HANDLER);

const {
    PORT,
    DOMAIN_NAME,
    emitter,
} = global.MY1_GLOBAL;

http.createServer(handleRequest).listen(PORT, '127.0.0.1', () => {

    emitter.emit(EVENT_SERVER_IS_RUNNING, new Date());

});

emitter.on(EVENT_SERVER_IS_RUNNING, (date) => {

    console.info(`${date} ${DOMAIN_NAME}:${PORT}`); // eslint-disable-line no-console

});
