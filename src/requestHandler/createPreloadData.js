function createPreloadData(results = [], queryKeys = []) {

    const preloadData = {};

    const errors = [];

    results.forEach((result, index) => {

        if (result.status === 'fulfilled' && result.value) {

            preloadData[queryKeys[index]] = result.value;

        }

        if (result.reason) {

            preloadData[queryKeys[index]] = result.reason.toString();
            errors.push(result.reason);

        }

    });

    errors.length && setTimeout(() => {

        throw errors;

    }, 10);

    return preloadData;

}

module.exports = createPreloadData;
