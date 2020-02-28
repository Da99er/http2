const { join } = require('path');

const {
    PATH_TO_MIDDLEWARES,
} = require(join(__dirname, '..', 'globals', 'pathTo'));

const handleRequest = require('./handleRequest');

const middlewares = require(PATH_TO_MIDDLEWARES);

const callback = ({
    req,
    res,
}) => {

    if (req.responceError) {

        res.statusCode = 503;
        res.end();

        throw req.responceError;

    }

    handleRequest(req, res)
        .catch((error) => {

            res.statusCode = 503;
            res.end();
            throw error;

        });

};

module.exports = () => (req, res) => {

    middlewares.init({
        req,
        res,
    }, callback);

};
