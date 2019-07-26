const replaceMaskToLocation = (fetchPreloadData = '', params) => {

    const queryObj = JSON.parse(decodeURIComponent(fetchPreloadData));

    Object.keys(queryObj).forEach((loader) => {

        if (queryObj[loader] && queryObj[loader].mask) {

            queryObj[loader] = params;

        }

    });

    return queryObj;

};

export default replaceMaskToLocation;
