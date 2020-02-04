const generateText = require('./generateText');

const testText = (params) => new Promise(((resolve, reject) => {

    const ans = {
        text: '',
        error: null,
    };

    if (params.test === 'erro') {

        reject('error is bad :(');

    }

    ans.text = generateText(params);

    resolve(ans);

}));

module.exports = testText;
