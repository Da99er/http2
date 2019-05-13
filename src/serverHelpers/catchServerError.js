const { UTILS } = global.MY1_GLOBAL;

UTILS.catchServerError = ({ req, res }) => (err) => {

    console.err(err); // eslint-disable-line no-console

    if (err.name === 'BulkWriteError' && err.toJSON) {

        switch (err.toJSON().code) {

            case 11000:
                req.responceError = {
                    errorCode: 770011,
                    httpCode: 503,
                };
                break;
            default:
                break;

        }

    }

    if (req.advancedOptions && req.advancedOptions.redirectBack) {

        res.writeHead(302, {
            Location: UTILS.queryObjAddFields(req.headers.referer, { errorCode: (req.responceError && req.responceError.errorCode) || 770000 }),
        });
        res.end();

    } else {

        if (req.responceError) {

            res.statusCode = req.responceError.httpCode;

        } else {

            res.statusCode = 503;

        }

        res.end(JSON.stringify(req.responceError));

    }

};
