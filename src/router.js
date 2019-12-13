const url = require('url');
const { join, extname } = require('path');
const MimeLookup = require('mime-lookup');
const mime = new MimeLookup(require('mime-db'));

const {
    APIV1,
    UTILS: {
        catchServerError,
        getFile,
        parse,
        stringify,
        matchPath,
        getItemsFromPath,
    },
    DOMAIN_NAME,
    PATH_TO_MIDDLEWARES,
    PATH_TO_SITE,
    PATH_TO_BUNDLE,
    PATH_TO_CLIENT,
    RELOAD_FILES_STORAGE,
} = global.MY1_GLOBAL;

const { Readable } = require('stream');

const middlewares = require(PATH_TO_MIDDLEWARES);

module.exports = () => (request, response) => {

    const callback = (() => {

        const urlParsed = url.parse(request.url, true);
        const reqType = mime.lookup(urlParsed.pathname);

        request.urlParsed = urlParsed;

        console.sent(DOMAIN_NAME, request.method, urlParsed.host, request.headers.referer, urlParsed.pathname); // eslint-disable-line no-console

        if (extname(urlParsed.pathname).length) {

            request = getFile(response, join(PATH_TO_SITE, urlParsed.pathname)); // eslint-disable-line no-param-reassign

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

                let graphQueryProperties = {};
                const items = parse(urlParsed.query.items);
                const params = parse(urlParsed.query.params);

                (async function() {

                    if (request.method === 'GET') {

                        graphQueryProperties = parse(urlParsed.query.query);

                    } else {

                        graphQueryProperties = req.body;

                    }

                    for (const property in graphQueryProperties) {

                        if (APIV1[property]) {

                            preloadData[property] = await APIV1[property](
                                graphQueryProperties[property], {
                                    items,
                                    params,
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

            if (reqType === 'application/octet-stream') {

                return ({
                    req,
                    res,
                }) => {

                    (async function() {

                        const PATH_TO_SERVER = join(PATH_TO_BUNDLE, RELOAD_FILES_STORAGE['server.js']);
                        const PATH_TO_ROUTES = join(PATH_TO_BUNDLE, RELOAD_FILES_STORAGE['routes.js']);

                        const routes = require(PATH_TO_ROUTES).default;

                        const preloadData = {};

                        const params = parse(urlParsed.query.params);
                        const activeRoute = matchPath(routes, urlParsed.pathname);
                        const graphQueryProperties = parse(activeRoute.preloadDataQuery);
                        const items = getItemsFromPath(activeRoute.path, urlParsed.pathname);

                        for (const property in graphQueryProperties) {

                            if (APIV1[property]) {

                                preloadData[property] = await APIV1[property]({
                                    ...graphQueryProperties[property],
                                }, {
                                    items,
                                    params,
                                    cookie: req.headers.cookie,
                                });

                            }

                        }

                        const responseStream = new Readable();

                        // TODO need build templates
                        const indexTemplate = require(join(PATH_TO_CLIENT, 'templates'));

                        responseStream.push(indexTemplate.START());

                        const appCreator = require(PATH_TO_SERVER).default;

                        responseStream.push(appCreator(preloadData, req.url));

                        responseStream.push(indexTemplate.END({
                            preloadDataQuery: activeRoute.preloadDataQuery,
                            items: stringify(items),
                        }));
                        responseStream.push(null);
                        // When React finishes rendering send the rest of your HTML to the browser
                        responseStream.on('end', () => res.end());
                        responseStream.on('close', () => responseStream.destroy());
                        responseStream.on('error', (err) => {

                            console.err(err); // eslint-disable-line no-console
                            res.end(indexTemplate.END(activeRoute.preloadDataQuery));

                        });

                        responseStream.pipe(res);

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
