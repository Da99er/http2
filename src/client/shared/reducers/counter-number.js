import actions from 'shared/const/actions';

const defaultState = {
    count: 0,
    error: null,
};

const counterReducer = (state = defaultState, action) => {

    const newState = JSON.parse(JSON.stringify(state));

    switch (action.type) {

        case actions.INCREMENT:
            newState.count = action.payload;
            return newState;
        case actions.DECREMENT:
            newState.count = action.payload;
            return newState;
        default:
            return state;

    }

};

export default counterReducer;
