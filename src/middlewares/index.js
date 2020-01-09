const fs = require('fs');
const { join } = require('path');

const { PATH_TO_MIDDLEWARES, PATH_TO_UTILS } = require(join(__dirname, '..', 'globals', 'path-to'));

const Middleware = require(join(PATH_TO_UTILS, 'Middleware'));

const files = fs.readdirSync(PATH_TO_MIDDLEWARES);

const middleware = new Middleware();

const runMiddlewareFunctions = files
    .map((midleware) => midleware.match(/\d+_([a-z0-9]+)/i))
    .filter((midleware) => midleware)
    .map((midleware) => require(join(PATH_TO_MIDDLEWARES, midleware[0])));

runMiddlewareFunctions.forEach((midleFunction) => {

    middleware.use(midleFunction);

});

module.exports = middleware;
