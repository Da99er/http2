const { UTILS } = global.MY1_GLOBAL;

UTILS.stringify = (obj = {}) => encodeURIComponent(JSON.stringify(obj));

UTILS.parse = (str = '%7B%7D') => JSON.parse(decodeURIComponent(str));
