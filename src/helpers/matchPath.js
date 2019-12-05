const { match, parse } = require('matchit');
const { UTILS } = global.MY1_GLOBAL;

UTILS.matchPath = (routes = [], url = '') => {

    const defaultRoute = {
        fetchPreloadData: UTILS.stringify({}),
    };

    const parsedRoutes = match(url, routes.map(({ path }) => path).map(parse));
    // const params = exec(url, parsedRoutes); // matchit

    let foundRoute;

    if (parsedRoutes.length) {

        foundRoute = routes.find(({ path }) => parsedRoutes[0].old === path);

    }

    if (!foundRoute) {

        foundRoute = routes.slice(-1)[0];

    }

    return foundRoute || defaultRoute;

};
