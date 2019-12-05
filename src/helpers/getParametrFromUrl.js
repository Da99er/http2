const { UTILS } = global.MY1_GLOBAL;

UTILS.getParametrFromUrl = (mask, path) => {

    if (!path) {

        return {};

    }

    const result = {};
    const paramNames = mask.split('/:').slice(1).filter(Boolean).reverse();
    const pathKeys = path.split('/').filter(Boolean).reverse();

    paramNames.forEach((key, index) => {

        result[key] = pathKeys[index];

    });

    return result;

};
