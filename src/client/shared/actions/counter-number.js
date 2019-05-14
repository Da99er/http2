import actions from '@globals/actions';

export const additiveCount = (count) => ({
    type: actions.INCREMENT,
    payload: count,
});

export const subtractiveCount = (count) => ({
    type: actions.DECREMENT,
    payload: count,
});
