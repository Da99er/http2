const testText = (params, { routerItems }) => new Promise(((resolve, reject) => {

    const ans = {
        text: '',
        error: null,
    };

    const newString = params.text ? params.text : 'emty';

    if (newString && routerItems.test === 'erro') {

        ans.error = 'error is bad :(';

        reject(ans);

    }

    ans.text = `text:${newString} router:${JSON.stringify(routerItems)} query params:${JSON.stringify(params)} `;

    resolve(ans);

}));

module.exports = testText;
