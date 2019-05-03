/* eslint-disable no-unused-vars */

const { APIV1 } = global.MY1_GLOBAL;

const ans = {
    count: 0,
    error: null,
};

APIV1['counter-number'] = ({ req, res, params: { choosen } }) => new Promise(((resolve, reject) => {

    if (choosen) {

        ans.count = Math.random() * choosen;

    }

    if (Math.random() > 0.8) {

        ans.error = 'random error';

    } else {

        ans.error = null;

    }

    resolve(ans);

}));
