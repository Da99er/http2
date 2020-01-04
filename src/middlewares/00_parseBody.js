const { join } = require('path');

const { PATH_TO_UTILS } = require(join(__dirname, '..', 'globals', 'path-to'));

const parseBody = require(join(PATH_TO_UTILS, 'parseBody'));

module.exports = ({ req, res }, next) => {

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {

        return parseBody(req, req).then((result) => {

            req.body = {
                ...req.body,
                ...result,
            };

            return next({ req, res });

        }).catch((err) => {

            console.err(err); // eslint-disable-line no-console

            req.responceError = {
                errorCode: 770041,
                httpCode: 400,
            };

            return next({ req, res });

        });

    }

    return next({ req, res });

};
