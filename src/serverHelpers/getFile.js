const fs = require('fs');

const { UTILS } = global.MY1_GLOBAL;

UTILS.getFile = function(res, path) {

    const file = fs.createReadStream(path);

    /* file.on('data', (chunk) => {
        console.log('@>chunk.length', chunk.length);
    });*/

    file.on('error', (err) => {

        console.err(err); // eslint-disable-line no-console
        res.statusCode = 404;
        res.end('404');
        file.close();

    });

    // file.on('finish', () => {});

    file.headers = {
        'accept-encoding': 'gzip',
    };

    file.method = 'GET';

    return file;

};
