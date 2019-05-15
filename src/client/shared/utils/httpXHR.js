const httpXHR = ({ method = 'GET', url, headers = {}, body }) => new Promise(((resolve, reject) => {

    if (window.IS_SERVER) {

        return resolve(null);

    }

    const xhr = new XMLHttpRequest();

    xhr.withCredentials = true;

    Object.keys(headers).forEach((headField) => {

        xhr.setRequestHeader(headField, headers[headField]);

    });

    xhr.open(method, url, true);

    xhr.onreadystatechange = function() {

        if (this.readyState !== 4) return;

        let ans;

        try {

            ans = JSON.parse(this.responseText);

        } catch (err) {

            ans = this.responseText;

        }

        if (ans.error) {

            reject(ans.error);

        }

        resolve(ans);

    };

    if (method === 'GET') {

        return xhr.send();

    }

    return xhr.send(body);

}));

export default httpXHR;
