const { match } = require('path-to-regexp');
const { UTILS } = global.MY1_GLOBAL;

const chekerOptions = { decode: decodeURIComponent };

UTILS.findActivePath = (routes = [], url = '') => {

    const defaultRoute = {
        preloadDataQuery: UTILS.stringify({}),
        routerItems: UTILS.stringify({}),
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
