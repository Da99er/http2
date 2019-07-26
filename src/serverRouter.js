const url = require('url');
const path = require('path');
const MimeLookup = require('mime-lookup');
const mime = new MimeLookup(require('mime-db'));

const {
    matchPath,
} = require('react-router-dom');

const {
    Readable,
} = require('stream');

const ReactDOMServer = require('react-dom/server');

const {
    APIV1,
    UTILS: {
        catchServerError,
        getFile,
    },
    DOMAIN_NAME,
    PATH_TO_MIDDLEWARES,
    PATH_TO_SITE,
    PATH_TO_BUNDLE,
    PATH_TO_TEMPLATES,
    PATH_TO_SHARED,
    RELOAD_FILES_STORAGE,
} = global.MY1_GLOBAL;

const qs = require(path.join(PATH_TO_SHARED, 'utils', 'prepareQuery'));

const rootIndex = require(path.join(PATH_TO_TEMPLATES, 'rootIndex'));

const middlewares = require(PATH_TO_MIDDLEWARES);

module.exports = () => (request, response) => {

    const callback = (() => {

        const urlParsed = url.parse(request.url, true);
        const reqType = mime.lookup(urlParsed.pathname);

        request.urlParsed = urlParsed;

        console.sent(DOMAIN_NAME, request.method, urlParsed.host, request.headers.referer, urlParsed.pathname); // eslint-disable-line no-console

        if (path.extname(urlParsed.pathname).length) {

            request = getFile(response, path.join(PATH_TO_SITE, urlParsed.pathname)); // eslint-disable-line no-param-reassign

            return ({
                req,
                res,
            }) => {

                req.pipe(res);

            };

        }

        if (urlParsed.pathname.indexOf('/apiv1/same-graphql') === 0) {

            return ({
                req,
                res,
            }) => {

                const preloadData = {};

                let graphQueryParams = {};

                (async function() {

                    if (request.method === 'GET') {

                        graphQueryParams = qs.parse(urlParsed.query.params);

                    } else if (request.method === 'POST') {

                        graphQueryParams = qs.parse(req.body);

                    }

                    for (const param in graphQueryParams) {

                        if (APIV1[param]) {

                            preloadData[param] = await APIV1[param]({
                                ...graphQueryParams[param],
                                pathname: graphQueryParams.pathname || null,
                                cookie: req.headers.cookie,
                            });

                        }

                    }

                    // @> STATUS CODE???????

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

            if (reqType === 'application/octet-stream') {

                return ({
                    req,
                    res,
                }) => {

                    (async function() {

                        const indexUrl = path.join(PATH_TO_BUNDLE, RELOAD_FILES_STORAGE['index.js'].split('/').pop());
                        const routesUrl = path.join(PATH_TO_BUNDLE, RELOAD_FILES_STORAGE['routes.js'].split('/').pop());

                        const index = require(indexUrl).default;
                        const routes = require(routesUrl).default;

                        const preloadData = {};

                        let responseStream = new Readable();

                        const activeRoute = routes.find((route) => matchPath(req.url, route)) || {};

                        responseStream.push('Page without render');
                        responseStream.push(null);

                        const graphQueryParams = qs.parse(activeRoute.fetchPreloadData) || {};

                        for (const param in graphQueryParams) {

                            if (APIV1[param]) {

                                preloadData[param] = await APIV1[param]({
                                    ...graphQueryParams[param],
                                    pathname: graphQueryParams.pathname || urlParsed.pathname,
                                    cookie: req.headers.cookie,
                                });

                            }

                        }

                        // TODO handle server status

                        // Render your frontend to a stream and pipe it to the response
                        const rootReactElement = index(preloadData, req.url);

                        responseStream = ReactDOMServer.renderToNodeStream(rootReactElement);

                        res.write(rootIndex.START());
                        // When React finishes rendering send the rest of your HTML to the browser
                        responseStream.on('end', () => {

                            res.end(rootIndex.END(activeRoute.fetchPreloadData));

                        });

                        responseStream.on('close', () => {

                            responseStream.destroy();

                        });

                        responseStream.on('error', (err) => {

                            console.err(err); // eslint-disable-line no-console

                            res.end(rootIndex.END(activeRoute.fetchPreloadData));

                        });

                        responseStream.pipe(res, {
                            end: 'false',
                        });

                    }()).catch(catchServerError({
                        req,
                        res,
                    }));

                };

            }

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
