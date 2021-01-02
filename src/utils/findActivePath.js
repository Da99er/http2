const { join } = require('path');
const { match } = require('path-to-regexp');

const { PATH_TO_UTILS } = require(join(__dirname, '..', 'globals', 'pathTo'));
const { stringify } = require(join(PATH_TO_UTILS, 'prepareQuery'));

const chekerOptions = { decode: decodeURIComponent };

function findActivePath(routes = [], url = '/') {

    const defaultRoute = {
        preloadDataQuery: stringify({}),
    };

    let foundParams = {};

    const foundedRoute = routes.find(({ path }) => {

        if (path === '*') {

            return true;

        }

        const chekedUrl = match(path, chekerOptions)(url);

        if (chekedUrl) {

            foundParams = chekedUrl.params;

        }

        return chekedUrl;

    });

    if (foundedRoute) {

        return {
            ...foundedRoute,
            routerItems: foundParams,
        };

    }

    return {
        ...defaultRoute,
        routerItems: foundParams,
    };

}

module.exports = findActivePath;
