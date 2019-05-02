const formidable = require('formidable');
const { UTILS, PATH_TO_BUNDLE } = global.MY1_GLOBAL;

UTILS.parseBody = (req, res) => new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars

    const form = new formidable.IncomingForm();

    const files = [];

    const fields = [];

    form.uploadDir = PATH_TO_BUNDLE;

    form.on('field', (field, value) => {

        fields.push([field, value]);

    })
        .on('file', (field, file) => {

            // file.name = true;
            files.push([field, file]);

        })
        .on('error', (err) => {

            req.responceError = {
                errorCode: 770041,
                httpCode: 403,
                errorBody: err,
            };

            reject({
                errorCode: 770041,
                httpCode: 403,
            });

        })
        .on('end', () => {

            if (form.headers['content-type'].includes('multipart/form-data; boundary=') || form.headers['content-type'].includes('application/json')) {

                if (!req.body) {

                    req.body = {};

                }

                fields.forEach((field) => {

                    req.body[field[0]] = field[1];

                });

                resolve(req.body);

            } else {

                reject({
                    errorCode: 770042,
                    httpCode: 503,
                });

            }

        });

    form.parse(req);

});
