const {
    UTILS: {
        catchServerError,
    },
} = global.MY1_GLOBAL;

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
