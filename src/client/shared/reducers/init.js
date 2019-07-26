import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';

import counterReducer from '@shared/reducers/counter-number';

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    form: formReducer,
    'counter-number': counterReducer,
});

export default rootReducer;
