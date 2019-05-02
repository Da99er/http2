// eslint-disable-next-line no-unused-vars
export default ({ method, params = {}, contentType, authorization }) => new Promise(((resolve, reject) => {

    if (window.IS_SERVER) {

        return resolve(void 0);

    }

    const xhr = new XMLHttpRequest();

    xhr.withCredentials = true;
    if (contentType) {

        xhr.setRequestHeader('Content-Type', contentType); // application/json

    }
    if (authorization) {

        xhr.setRequestHeader('Authorization', authorization); // "JWT eyJhbGciO.iJIUzI1Ni.IsInR5c"

    }

    if (method === 'GET') {

        xhr.open(method, `/apiv1/same-graphql?params=${encodeURIComponent(JSON.stringify(params))}`, true);

    } else {

        xhr.open(method, '/apiv1/same-graphql', true);

    }

    xhr.onreadystatechange = function() {

        if (this.readyState !== 4) {

            return;

        }

        let ans = {};

        try {

            ans = JSON.parse(this.responseText);

        } catch (err) {

            ans.error = err;

        }

        resolve(ans);

    };

    return xhr.send(encodeURIComponent(JSON.stringify(params)));

}));
