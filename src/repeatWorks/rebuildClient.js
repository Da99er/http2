const http = require('http');
const { join } = require('path');
const fs = require('fs');

const {
    PORT,
    ROOTDIR,
    DOMAIN_NAME,
    PATH_TO_BUNDLE,
    PATH_TO_TEMP,
    RELOAD_FILES_STORAGE,
} = global.MY1_GLOBAL;

const serverRouter = require(join(ROOTDIR, 'router'));

http.createServer(serverRouter()).listen(PORT, '127.0.0.1', () => {

    console.info(`${DOMAIN_NAME}:${PORT}`); // eslint-disable-line no-console

});

const startWatch = () => {

    setInterval(() => {

        fs.readdir(PATH_TO_BUNDLE, (errorReadDir, files) => {

            if (errorReadDir) {

                throw errorReadDir;

            }

            if (files.join('') !== Object.keys(RELOAD_FILES_STORAGE).join('')) {

                Object.keys(RELOAD_FILES_STORAGE).forEach((file) => {

                    const filePath = join(PATH_TO_BUNDLE, RELOAD_FILES_STORAGE[file]);

                    delete require.cache[filePath];
                    delete RELOAD_FILES_STORAGE[file];

                });

                files.forEach((file) => {

                    const fileKey = file.split('.').slice(-2).join('.');

                    RELOAD_FILES_STORAGE[fileKey] = file;

                });

            }

        });

    }, 1000);

};

// this only for temp router
const checkRoutes = setInterval(() => {

    // eslint-disable-next-line no-unused-vars
    fs.stat(join(PATH_TO_TEMP, 'routes.js'), (err, stats) => {

        if (Boolean(err) === false) {

            clearInterval(checkRoutes);
            startWatch();

        }

    });

}, 1000);
