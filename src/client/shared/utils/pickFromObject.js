const getKeysFromObject = (obj, keys) => {

    const newObj = {};

    keys.forEach((el) => {

        newObj[el] = obj[el];

    });

    return newObj;

};

module.exports = getKeysFromObject;
