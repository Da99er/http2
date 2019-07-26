import actions from '@globals/actions';

const defaultState = {
    count: 0,
    error: null,
};

const counterReducer = (state = defaultState, action) => {

    switch (action.type) {

        case actions.INCREMENT:
            state.count = action.payload;
            break;
        case actions.DECREMENT:
            state.count = action.payload;
            break;
        default:
            break;

    }

    return state;

};

export default counterReducer;
