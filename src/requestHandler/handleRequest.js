const url = require('url');
const { join, extname } = require('path');

const {
    PATH_TO_UTILS,
    PATH_TO_SITE,
    PATH_TO_BUNDLE,
    PATH_TO_CLIENT,
} = require(join(__dirname, '..', 'globals', 'path-to'));

const getFile = require(join(PATH_TO_UTILS, 'getFile'));
const { parse, stringify } = require(join(PATH_TO_UTILS, 'prepareQuery'));
const findActivePath = require(join(PATH_TO_UTILS, 'findActivePath'));
const catchAsyncError = require(join(PATH_TO_UTILS, 'catchAsyncError'));

const appCreatorWorker = require('./appCreatorWorker');
const createPreloadData = require('./createPreloadData');

const {
    APIV1,
    RELOAD_FILES_STORAGE,
} = global.MY1_GLOBAL;

// eslint-disable-next-line func-style
async function handleRequest(req, res) {

    const urlParsed = url.parse(req.url, true);

    if (extname(urlParsed.pathname).length) {

        const fileRequest = getFile(res, join(PATH_TO_SITE, urlParsed.pathname));

        return fileRequest.pipe(res);

    }

    if (urlParsed.pathname.indexOf('/apiv1/same-graphql') === 0) {

        const graphQueryProperties = (req.body ? req.body : parse(urlParsed.query.params)) || {};

        const keys = Object.keys(graphQueryProperties);
        const promises = keys.map((property) => {

            if (APIV1[property]) {

                return APIV1[property]({
                    ...graphQueryProperties[property],
                    cookie: req.headers.cookie,
                });

            }

            return Promise.resolve(null);

        });

        const results = await Promise.allSettled(promises).catch(catchAsyncError);
        const preloadData = createPreloadData(keys, results);

        // TODO RESPONSE STATUS CODE

        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(preloadData));

    }

    if (req.method === 'GET') {

        const PATH_TO_SERVER = join(PATH_TO_BUNDLE, RELOAD_FILES_STORAGE['server.js']);
        const PATH_TO_ROUTES = join(PATH_TO_BUNDLE, RELOAD_FILES_STORAGE['routes.js']);

        const routes = require(PATH_TO_ROUTES).default;

        const params = parse(urlParsed.query.params) || {};
        const activeRoute = findActivePath(routes, urlParsed.pathname);
        const graphQueryProperties = parse(activeRoute.preloadDataQuery);

        const preloadQuery = {};
        const keys = Object.keys(graphQueryProperties);
        const promises = keys.map((property) => {

            if (APIV1[property]) {

                preloadQuery[property] = {
                    ...params,
                    ...activeRoute.routerItems,
                    ...graphQueryProperties[property],
                    pathname: urlParsed.pathname,
                };

                return APIV1[property]({
                    ...params,
                    ...activeRoute.routerItems,
                    ...graphQueryProperties[property],
                    pathname: urlParsed.pathname,
                    cookie: req.headers.cookie,
                });

            }

            return Promise.resolve(null);

        });

        const results = await Promise.allSettled(promises).catch(catchAsyncError);
        const preloadData = createPreloadData(keys, results);

        // TODO need build templates
        const indexTemplate = require(join(PATH_TO_CLIENT, 'templates'));

        res.write(indexTemplate.START());

        const appHtml = await appCreatorWorker({
            serverFile: PATH_TO_SERVER,
            preloadData,
            url: req.url,
        }).catch(catchAsyncError);

        res.write(appHtml || '');

        res.write(indexTemplate.END(stringify(preloadQuery)));
        res.end();

    }

    res.statusCode = 404;
    return res.end('not found');

}

module.exports = handleRequest;
