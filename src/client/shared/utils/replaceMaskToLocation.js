const replaceMaskToLocation = (fetchPreloadData = '', params) => {

    const queryObj = JSON.parse(decodeURIComponent(fetchPreloadData));

    Object.keys(queryObj).forEach((key) => {

        if (queryObj[key] && queryObj[key].mask) {

            queryObj[key] = params;

        }

    });

    return queryObj;

};

export default replaceMaskToLocation;
