const url = require('url');
const { join, extname } = require('path');

const {
    PATH_TO_UTILS,
    PATH_TO_SITE,
} = require(join(__dirname, '..', 'globals', 'pathTo'));

const {
    DOMAIN_NAME,
    PORT,
} = require(join(__dirname, '..', 'globals', 'server'));

const getFile = require(join(PATH_TO_UTILS, 'getFile'));
const { parse } = require(join(PATH_TO_UTILS, 'prepareQuery'));
const findActivePath = require(join(PATH_TO_UTILS, 'findActivePath'));
const catchAsyncError = require(join(PATH_TO_UTILS, 'catchAsyncError'));

const createPreloadData = require('./createPreloadData');
const appCreatorWorker = require('./appCreatorWorker');
const { getCachedData, setCachedPage } = require('./getCachedData');

async function handleRequest(req, res) {

    if (req.headers.host !== `localhost:${PORT}` && req.headers.host.includes(DOMAIN_NAME) === false) {

        return res.end(null);

    }

    const {
        APIV1,
        RELOAD_FILES_STORAGE,
    } = global.MY1_GLOBAL;

    const urlParsed = req.urlParsed = url.parse(req.url, true);

    if (extname(urlParsed.pathname).length) {

        const fileRequest = getFile(res, join(PATH_TO_SITE, urlParsed.pathname));

        return fileRequest.pipe(res);

    }

    if (urlParsed.pathname.indexOf('/apiv1/same-graphql') === 0) {

        res.setHeader('Content-Type', 'application/json; charset=UTF-8');

        const queryObj = req.body || urlParsed.query;
        const queryKeys = Object.keys(queryObj);
        const promises = queryKeys.map((property) => {

            if (APIV1[property]) {

                return APIV1[property]({
                    ...parse(queryObj[property]),
                    cookie: req.headers.cookie,
                });

            }

            return null;

        });

        const results = await Promise.allSettled(promises);

        const preloadData = createPreloadData(results, queryKeys);
        const fullPreloadData = {
            ...preloadData,
        };

        return res.end(JSON.stringify(fullPreloadData));

    }

    if (req.method === 'GET') {

        res.setHeader('Content-Type', 'text/html; charset=UTF-8');

        const oldCacheData = getCachedData(req);

        if (oldCacheData) {

            res.statusCode = oldCacheData.statusCode;
            res.end(oldCacheData.appHtml);

        }

        const PATH_TO_SERVER = RELOAD_FILES_STORAGE['server.js'];
        const PATH_TO_ROUTES = RELOAD_FILES_STORAGE['routes.js'];

        const routes = require(PATH_TO_ROUTES).default;

        const preloadQuery = {};
        const activeRoute = findActivePath(routes, urlParsed.pathname);
        const queryObj = parse(activeRoute.preloadDataQuery);
        const queryKeys = Object.keys(queryObj);

        const promises = queryKeys.map((property) => {

            if (APIV1[property]) {

                preloadQuery[property] = {
                    ...urlParsed.query,
                    ...queryObj[property],
                    ...activeRoute.routerItems,
                    pathname: urlParsed.pathname,
                };

                return APIV1[property]({
                    ...urlParsed.query,
                    ...queryObj[property],
                    ...activeRoute.routerItems,
                    pathname: urlParsed.pathname,
                    cookie: req.headers.cookie,
                });

            }

            return Promise.resolve(null);

        });

        const results = await Promise.allSettled(promises);

        const preloadData = createPreloadData(results, queryKeys);
        const fullPreloadData = {
            ...preloadData,
        };

        const serverAnswer = await appCreatorWorker({
            serverFile: PATH_TO_SERVER,
            fileStorage: RELOAD_FILES_STORAGE,
            preloadData: fullPreloadData,
            preloadQuery,
            location: urlParsed,
        }).catch(catchAsyncError) || {};

        const newCache = {
            statusCode: serverAnswer.statusCode || 200,
            appHtml: serverAnswer.appHtml,
        };

        setCachedPage(req, newCache);

        if (res.writableFinished === false) {

            res.statusCode = newCache.statusCode;
            res.end(newCache.appHtml);

        }

        return null;

    }

    res.statusCode = 404;
    return res.end('not found');

}

module.exports = handleRequest;
