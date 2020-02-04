const createPreloadData = (keys, results) => {

    const preloadData = {};

    results.forEach((result, index) => {

        preloadData[keys[index]] = result.status === 'fulfilled' ? result.value : { error: result.reason };

    });

    return preloadData;

};

module.exports = createPreloadData;
