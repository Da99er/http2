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

const qs = require(path.join(PATH_TO_SHARED, 'lib', 'prepareQuery'));

const rootIndex = require(path.join(PATH_TO_TEMPLATES, 'rootIndex'));

const middlewares = require(PATH_TO_MIDDLEWARES);

module.exports = () => (request, response) => {

    const urlParsed = url.parse(request.url, true);
    const reqType = mime.lookup(urlParsed.pathname);

    let callback;

    request.urlParsed = urlParsed;

    console.sent(DOMAIN_NAME, request.method, urlParsed.host, request.headers.referer, urlParsed.pathname); // eslint-disable-line no-console

    // response.setHeader('Access-Control-Allow-Origin', '*');

    if (urlParsed.pathname.indexOf('/apiv1/same-graphql') === 0) {

        callback = ({
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

                for (const i in graphQueryParams) {

                    if (APIV1[i]) {

                        preloadData[i] = await APIV1[i]({
                            req,
                            res,
                            params: graphQueryParams[i],
                        });

                    }

                }

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

    } else if (request.method === 'GET') {

        if (reqType === 'application/octet-stream') {

            callback = ({
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

                    responseStream.push(' ');
                    responseStream.push(null);

                    try {

                        const activeRoute = routes.find((route) => matchPath(req.url, route)) || {};

                        const graphQueryParams = qs.parse(activeRoute.fetchPreloadData);

                        for (const i in graphQueryParams) {

                            if (APIV1[i]) {

                                preloadData[i] = await APIV1[i]({
                                    req,
                                    res,
                                    params: graphQueryParams[i],
                                });

                            }

                        }

                        // Render your frontend to a stream and pipe it to the response
                        const rootReactElement = index(preloadData, req.url);

                        responseStream = ReactDOMServer.renderToNodeStream(rootReactElement);

                    } catch (err) {

                        console.err(err); // eslint-disable-line no-console

                    }

                    res.write(rootIndex.START());
                    // When React finishes rendering send the rest of your HTML to the browser
                    responseStream.on('end', () => {

                        res.end(rootIndex.END(preloadData));

                    });

                    responseStream.on('close', () => {

                        responseStream.destroy();

                    });

                    responseStream.on('error', (err) => {

                        console.err(err); // eslint-disable-line no-console

                        res.end(rootIndex.END(preloadData));

                    });

                    responseStream.pipe(res, {
                        end: 'false',
                    });

                }()).catch(catchServerError({
                    req,
                    res,
                }));

            };

        } else if (reqType !== 'application/octet-stream') {

            request = getFile(response, path.join(PATH_TO_SITE, urlParsed.pathname)); // eslint-disable-line no-param-reassign

            callback = ({
                req,
                res,
            }) => {

                req.pipe(res);

            };

        }

    } else {

        callback = ({
            req, // eslint-disable-line no-unused-vars
            res,
        }) => {

            res.statusCode = '404';
            res.end('not found');

        };

    }

    middlewares.init({
        req: request,
        res: response,
    }, callback);

};
