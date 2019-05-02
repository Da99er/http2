const {
    UTILS: {
        parseBody,
    },
} = global.MY1_GLOBAL;

module.exports = ({ req, res }, next) => {

    if (req.method === 'POST') {

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
                httpCode: 403,
            };

            return next({ req, res });

        });

    }

    return next({ req, res });

};
