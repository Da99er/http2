const stringify = (obj = {}) => encodeURIComponent(JSON.stringify(obj));

const parse = (str = '%7B%7D') => JSON.parse(decodeURIComponent(str));

module.exports = {
    stringify,
    parse,
};
