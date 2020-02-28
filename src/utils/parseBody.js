const formidable = require('formidable');
const { PATH_TO_SITE } = require('../globals/pathTo');

const parseBody = (req, res) => new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars

    const headers = req.headers;
    const form = new formidable.IncomingForm();

    form.uploadDir = `${PATH_TO_SITE}/uploads`;

    form.parse(req, (error, fields, files) => {

        if (error) {

            req.responceError = {
                errorCode: 770041,
                httpCode: 403,
                errorBody: error,
            };
            reject(req.responceError);

        }

        req.body = {
            ...fields,
            ...files,
        };

        if (headers['same-graphql']) {

            req.body = JSON.parse(Object.keys(fields)[0]);

        }

        resolve(req.body);

    });

});

module.exports = parseBody;
