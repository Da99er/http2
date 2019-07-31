import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import thunk from 'redux-thunk';

import { createBrowserHistory, createMemoryHistory } from 'history';
import { Route, Switch, StaticRouter } from 'react-router-dom';

import { ConnectedRouter, routerMiddleware } from 'connected-react-router';

import rootReducer from '@shared/reducers/init';
import routes from '@temp/routes';

import sameGraphQl from '@shared/utils/sameGraphQl';

const siteRender = (initalState, requestUrl) => {

    const history = window.IS_SERVER ? createMemoryHistory() : createBrowserHistory();
    // Build the middleware for intercepting and dispatching navigation actions
    const middlewareOfHistory = routerMiddleware(history);
    // Add the reducer to your store on the `router` key
    // Also apply our middleware for navigating

    const middlewares = [middlewareOfHistory, thunk];

    if (MODE === 'development') { // eslint-disable-line no-undef

        // middlewares.push(require('redux-logger').logger);

    }

    const store = createStore(
        rootReducer(history),
        initalState,
        applyMiddleware(...middlewares),
    );

    const context = {};

    const SiteRouter = window.IS_SERVER ? StaticRouter : ({ children }) => children;

    return (
        <Provider store={store} >
            <ConnectedRouter history={history} >
                <SiteRouter location={requestUrl} context={context} >
                    <Switch>
                        {(routes || []).map((route) => {

                            const Component = route.component;

                            return (
                                <Route
                                    exact={route.exact}
                                    path={route.path}
                                    key={route.path}
                                    render={(props) => <Component {...props} fetchPreloadData={route.fetchPreloadData} />}
                                />
                            );

                        })}
                    </Switch>
                </SiteRouter>
            </ConnectedRouter>
        </Provider>
    );

};

if (!window.IS_SERVER) {

    const pageQueryRaw = document.getElementById('preloadData').innerHTML.slice(1, -1);

    const parsedPageQuery = JSON.parse(decodeURIComponent(pageQueryRaw).trim() || '{}');

    parsedPageQuery.pathname = location.pathname;

    sameGraphQl({
        method: 'GET',
        params: parsedPageQuery,
    })
        .then((res) => {

            ReactDOM.hydrate(
                siteRender(res),
                document.getElementById('root')
            );

        })
        .catch((err) => {

            console.error(err); // eslint-disable-line no-console

        });

}

export default siteRender;
