const httpXHR = ({ path, type = 'GET', contentType, authorization, data }) => new Promise(((resolve, reject) => {

    if (window.IS_SERVER) {

        return resolve(void 0);

    }

    const xhr = new XMLHttpRequest();

    xhr.withCredentials = true;

    xhr.open(type, path, true);

    contentType && xhr.setRequestHeader('Content-Type', contentType); // application/json

    authorization && xhr.setRequestHeader('Authorization', authorization); // "JWT eyJhbGciO.iJIUzI1Ni.IsInR5c"

    // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

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

    if (type === 'GET') {

        xhr.send();

    }

    return xhr.send(data);

}));

export default httpXHR;
