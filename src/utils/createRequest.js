const https = require('https');

function createRequest(options, body) {

    return new Promise((resolve, reject) => {

        const deliverRequest = https.request(options, (response) => {

            const buffer = [];

            let responseText = '';

            response.on('data', (chunk) => {

                buffer.push(chunk);

            });

            response.on('error', (err) => {

                console.err(err); // eslint-disable-line no-console
                reject({ errorCode: 770043, ...options });

            });

            response.on('end', () => {

                try {

                    responseText = Buffer.concat(buffer).toString('utf8');

                } catch (err) {

                    reject({ errorCode: 770044, ...options });

                }
                resolve(responseText);

            });

        });

        deliverRequest.on('error', (err) => {

            reject({ errorCode: 770044, errorBody: err, ...options });

        });

        deliverRequest.end(body);

    });

}

module.exports = createRequest;
