const { APIV1 } = global.MY1_GLOBAL;

const ans = {
    text: '',
    error: null,
};

APIV1.testText = ({ text }, { routerItems, params }) => new Promise(((resolve, reject) => {

    const newString = text ? text : 'emty';

    if (newString && routerItems.test === 'erro') {

        ans.error = 'error is bad :(';

        reject(ans);

    }

    ans.text = `text:${newString} router:${JSON.stringify(routerItems)} query params:${JSON.stringify(params)} `;

    resolve(ans);

}));
