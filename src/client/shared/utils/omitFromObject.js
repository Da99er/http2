const getKeysFromObject = (obj, ignoreKeys) => {

    const newObj = {};

    for (const key in obj) {

    	if (ignoreKeys.includes(key)) {

    		continue;

        }
    	newObj[key] = obj[key];

    }
    return newObj;

};

module.exports = getKeysFromObject;
