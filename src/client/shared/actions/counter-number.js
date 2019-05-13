import { actions } from 'glb';

export const additiveCount = (count) => ({
    type: actions.INCREMENT,
    payload: count,
});

export const subtractiveCount = (count) => ({
    type: actions.DECREMENT,
    payload: count,
});
