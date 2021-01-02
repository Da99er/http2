const { join } = require('path');

const {
    PATH_TO_MIDDLEWARES,
} = require(join(__dirname, '..', 'globals', 'pathTo'));

const handleRequest = require('./handleRequest');

const middlewares = require(PATH_TO_MIDDLEWARES);

function callback({ req, res }) {

    if (req.responceError) {

        res.statusCode = 503;
        res.end();

        throw req.responceError;

    }

    return handleRequest(req, res)
        .catch((error) => {

            res.statusCode = 503;
            res.end();
            throw error;

        });

}

function handler(req, res) {

    middlewares.init({
        req,
        res,
    }, callback);

}

module.exports = handler;
