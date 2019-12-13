/* eslint-disable no-unused-vars */

const { APIV1 } = global.MY1_GLOBAL;

const ans = {
    color: '000000',
    error: null,
};

const generateColor = (c1 = ans.color, c2 = ans.color) => (c1[0] + c1[0] + c2[1] + c2[1] + c1[2] + c1[2] + c1[3] + c2[3]).replace('.', '').slice(0, 6);

APIV1.someColor = ({ color }, { items }) => new Promise(((resolve, reject) => {

    if (color) {

        ans.color = generateColor(color, items.color);

    }

    if (/[a-z]/gi.test(ans.color)) {

        ans.error = 'random error';

    }

    resolve(ans);

}));
