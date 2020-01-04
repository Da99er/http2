const { join } = require('path');

const { PATH_TO_UTILS } = require(join(__dirname, '..', 'globals', 'path-to'));
const catchServerError = join(PATH_TO_UTILS, 'catchServerError');

module.exports = ({ req, res }, next) => {

    if (req.responceError) {

        console.err('99_catchErrorMiddleware', req.responceError); // eslint-disable-line no-console
        return catchServerError({ req, res })({});

    }

    if (!next) {

        console.err('99_catchErrorMiddleware next is undefined'); // eslint-disable-line no-console
        return catchServerError({ req, res })({});

    }

    return next({ req, res });

};
