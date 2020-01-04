const { join } = require('path');
const { match } = require('path-to-regexp');

const { PATH_TO_UTILS } = require(join(__dirname, '..', 'globals', 'path-to'));
const { stringify } = require(join(PATH_TO_UTILS, 'prepareQuery'));

const chekerOptions = { decode: decodeURIComponent };

const findActivePath = (routes = [], url = '') => {

    const defaultRoute = {
        preloadDataQuery: stringify({}),
        routerItems: stringify({}),
    };

    const foundedRoute = routes.find(({ path }) => {

        const chekedUrl = match(path, chekerOptions)(url);

        if (chekedUrl) {

            defaultRoute.routerItems = chekedUrl.params;

        }

        return chekedUrl;

    });

    if (foundedRoute) {

        return {
            ...foundedRoute,
            routerItems: foundedRoute.path === '/:anything*' ? {} : defaultRoute.routerItems,
        };

    }

    return defaultRoute;

};

module.exports = findActivePath;
