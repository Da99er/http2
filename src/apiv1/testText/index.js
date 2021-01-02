const generateText = require('./generateText');

function testText(params) {

    return new Promise(((resolve, reject) => {

        const ans = {
            key: 'testText',
            text: '',
            error: null,
        };

        if (params.test === 'erro') {

            reject('error is bad :(');

        }

        ans.text = generateText(params);

        resolve(ans);

    }));

}

module.exports = testText;
