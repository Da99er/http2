import { stringify } from 'shared/utils/prepareQuery';

import NotFound from 'screens/NotFound';

const routes = [{
    path: '/',
    exact: true,
    component: NotFound,
    fetchPreloadData: stringify({
        'counter-number': {
            choosen: 0,
        },
    }),
}, {
    path: '*',
    exact: true,
    component: NotFound,
    fetchPreloadData: stringify({
        'counter-number': {
            choosen: 0,
        },
    }),
}];

export default routes;
