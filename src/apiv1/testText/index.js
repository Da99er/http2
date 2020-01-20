const generateText = require('./generateText');

const testText = (params) => new Promise(((resolve, reject) => {

    const ans = {
        text: '',
        error: null,
    };

    if (params.test === 'erro') {

        ans.error = 'error is bad :(';

        reject(ans);

    }

    ans.text = generateText(params);

    resolve(ans);

}));

module.exports = testText;
