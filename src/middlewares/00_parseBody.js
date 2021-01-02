const { join } = require('path');

const { PATH_TO_UTILS } = require(join(__dirname, '..', 'globals', 'pathTo'));

const parseBody = require(join(PATH_TO_UTILS, 'parseBody'));

// eslint-disable-next-line consistent-return
module.exports = ({ req, res }, next) => {

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {

        return parseBody(req).then((result) => {

            req.body = {
                ...req.body,
                ...result,
            };

            next({ req, res });

        }).catch((error) => {

            req.responceError = error;

            next({ req, res });

        });

    }

    next({ req, res });

};
