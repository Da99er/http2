const url = require('url');
const { join, extname } = require('path');

const {
    PATH_TO_UTILS,
    PATH_TO_MIDDLEWARES,
    PATH_TO_SITE,
    PATH_TO_BUNDLE,
    PATH_TO_CLIENT,
} = require(join(__dirname, 'globals', 'path-to'));

const catchServerError = require(join(PATH_TO_UTILS, 'catchServerError'));
const getFile = require(join(PATH_TO_UTILS, 'getFile'));
const { parse, stringify } = require(join(PATH_TO_UTILS, 'prepareQuery'));
const findActivePath = require(join(PATH_TO_UTILS, 'findActivePath'));

const {
    APIV1,
    DOMAIN_NAME,
    RELOAD_FILES_STORAGE,
} = global.MY1_GLOBAL;

const { Readable } = require('stream');

const middlewares = require(PATH_TO_MIDDLEWARES);

module.exports = () => (request, response) => {

    const callback = (() => {

        const urlParsed = url.parse(request.url, true);

        request.urlParsed = urlParsed;

        console.sent(DOMAIN_NAME, request.method, urlParsed.host, request.headers.referer, urlParsed.pathname); // eslint-disable-line no-console

        if (extname(urlParsed.pathname).length) {

            request = getFile(response, join(PATH_TO_SITE, urlParsed.pathname)); // eslint-disable-line no-param-reassign

            return ({
                req,
                res,
            }) => req.pipe(res);

        }

        if (urlParsed.pathname.indexOf('/apiv1/same-graphql') === 0) {

            return ({
                req,
                res,
            }) => {

                const preloadData = {};

                let graphQueryProperties = {};

                (async function() {

                    if (req.body) {

                        graphQueryProperties = req.body;

                    } else {

                        graphQueryProperties = parse(urlParsed.query.params) || {};

                    }

                    for (const property in graphQueryProperties) {

                        if (APIV1[property]) {

                            preloadData[property] = await APIV1[property]({
                                ...graphQueryProperties[property],
                                cookie: req.headers.cookie,
                            });

                        }

                    }

                    // TODO RESPONSE STATUS CODE

                    return preloadData;

                }())
                .then((resultGraphql) => {

                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(resultGraphql));

                })
                    .catch(catchServerError({
                        req,
                        res,
                    }));

            };

        }

        if (request.method === 'GET') {

            return ({
                req,
                res,
            }) => {

                (async function() {

                    const PATH_TO_SERVER = join(PATH_TO_BUNDLE, RELOAD_FILES_STORAGE['server.js']);
                    const PATH_TO_ROUTES = join(PATH_TO_BUNDLE, RELOAD_FILES_STORAGE['routes.js']);

                    const routes = require(PATH_TO_ROUTES).default;

                    const params = parse(urlParsed.query.params) || {};
                    const activeRoute = findActivePath(routes, urlParsed.pathname);
                    const graphQueryProperties = parse(activeRoute.preloadDataQuery);

                    const preloadData = {};

                    const preloadQuery = {};

                    for (const property in graphQueryProperties) {

                        if (APIV1[property]) {

                            preloadData[property] = await APIV1[property]({
                                ...params,
                                ...activeRoute.routerItems,
                                ...graphQueryProperties[property],
                                pathname: urlParsed.pathname,
                                cookie: req.headers.cookie,
                            });

                            preloadQuery[property] = {
                                ...params,
                                ...activeRoute.routerItems,
                                ...graphQueryProperties[property],
                                pathname: urlParsed.pathname,
                            };

                        }

                    }

                    const responseStream = new Readable();

                    // TODO need build templates
                    const indexTemplate = require(join(PATH_TO_CLIENT, 'templates'));

                    responseStream.push(indexTemplate.START());

                    const appCreator = require(PATH_TO_SERVER).default;

                    responseStream.push(appCreator(preloadData, req.url));
                    responseStream.push(indexTemplate.END(stringify(preloadQuery)));
                    responseStream.push(null);
                    // When React finishes rendering send the rest of your HTML to the browser
                    responseStream.on('end', () => res.end());
                    responseStream.on('close', () => responseStream.destroy());
                    responseStream.on('error', (err) => {

                        console.err(err); // eslint-disable-line no-console
                        res.end(indexTemplate.END(stringify(preloadQuery)));

                    });

                    responseStream.pipe(res);

                }()).catch(catchServerError({
                    req,
                    res,
                }));

            };

        }

        return ({
            req, // eslint-disable-line no-unused-vars
            res,
        }) => {

            res.statusCode = 404;
            res.end('not found');

        };

    })();

    middlewares.init({
        req: request,
        res: response,
    }, callback);

};
