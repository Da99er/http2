const {
    PORT,
    ROOTDIR,
    DOMAIN_NAME,
    PATH_TO_BUNDLE,
    PATH_TO_PUBLIC,
    PATH_TO_TEMP,
    RELOAD_FILES_STORAGE,
} = global.MY1_GLOBAL;

const http = require('http');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const webpackConfig = require(path.join(ROOTDIR, 'webpack.config'))();
const compiler = webpack(webpackConfig);

const serverRouter = require(path.join(ROOTDIR, 'serverRouter'));

http.createServer(serverRouter()).listen(PORT || 3000, '127.0.0.1', () => {

    console.info(`${DOMAIN_NAME}:${PORT || 3000}`); // eslint-disable-line no-console

});

const startWatch = () => {

    compiler.watch({
        aggregateTimeout: 500, // wait so long for more changes
        poll: true, // use polling instead of native watchers
        ignored: /node_modules/,
        progress: true,
        stats: 'errors-only',
    },
    (errBundle, stats) => {

        // eslint-disable-next-line no-console
        console.log(stats.toString({colors: true}));

        Object.keys(RELOAD_FILES_STORAGE).forEach((file) => {

            const filePath = path.join(PATH_TO_BUNDLE, RELOAD_FILES_STORAGE[file]);

            delete require.cache[filePath];
            delete RELOAD_FILES_STORAGE[file];

        });

        const build = stats.toJson({
            assets: true,
            hash: true,
        });

        if (build.children && build.children.length) {

            build.children[0].assets.forEach((asset) => {

                const fileKey = asset.name.replace(/\.[0-9a-z]+\./g, '.');

                RELOAD_FILES_STORAGE[fileKey] = path.join(PATH_TO_PUBLIC, asset.name);

            });

        }

        fs.readdir(PATH_TO_BUNDLE, (errorReadDir, files) => {

            if (errorReadDir) throw errorReadDir;

            const bundleFiles = Object.values(RELOAD_FILES_STORAGE).map((file) => file.split('/').pop());

            files.forEach((file) => {

                if (!bundleFiles.includes(file)) {

                    // eslint-disable-next-line max-nested-callbacks
                    fs.unlink(path.join(PATH_TO_BUNDLE, file), (err) => {

                        if (err) throw err;

                    });

                }

            });

        });

        // eslint-disable-next-line no-console
        console.info(`https://${DOMAIN_NAME}:${PORT || 3000}`);

    });

};

// this only for temp router
const checkRoutes = setInterval(() => {

    // eslint-disable-next-line no-unused-vars
    fs.stat(path.join(PATH_TO_TEMP, 'routes.js'), (err, stats) => {

        if (Boolean(err) === false) {

            clearInterval(checkRoutes);
            startWatch();

        }

    });

}, 1000);
