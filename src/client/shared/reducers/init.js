import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import counterReducer from 'shared/reducers/counter-number';

const rootReducer = combineReducers({
    router: routerReducer,
    'counter-number': counterReducer,
});

export default rootReducer;
