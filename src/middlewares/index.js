const fs = require('fs');
const path = require('path');

const { UTILS, PATH_TO_MIDDLEWARES } = global.MY1_GLOBAL;

const files = fs.readdirSync(PATH_TO_MIDDLEWARES);

const middleware = new UTILS.Middleware();

const runMiddlewareFunctions = files
    .map((e) => e.match(/\d+_([a-z0-9]+)/i))
    .filter((e) => e)
    .map((e) => require(path.join(PATH_TO_MIDDLEWARES, e[0])));

runMiddlewareFunctions.forEach((midleFunction) => {

    middleware.use(midleFunction);

});

module.exports = middleware;
