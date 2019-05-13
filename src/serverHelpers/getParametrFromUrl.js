const { UTILS } = global.MY1_GLOBAL;

UTILS.getParametrFromUrl = function(mask, path) {

    const result = {};
    const paramNames = mask.split('/:').filter(Boolean);
    const pathKeys = path.split('/').filter(Boolean);

    for (let i = paramNames.length - 1; i >= 0; i = i - 1) {

        if (pathKeys[i]) {

            result[paramNames[i]] = pathKeys[i];

        }

    }

    return result;

};
