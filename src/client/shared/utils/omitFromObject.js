const omitFromObject = (obj = {}, ignoreKeys) => {

    const newObj = {};

    Object.keys(obj).forEach((objKey) => {

        if (ignoreKeys.includes(objKey)) {

            return;

        }

        newObj[objKey] = obj[objKey];

    });

    return newObj;

};

module.exports = omitFromObject;
