import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import counterReducer from 'shared/reducers/counter-number';

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    'counter-number': counterReducer,
});

export default rootReducer;
