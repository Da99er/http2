const querystring = require('querystring');
const url = require('url');

const { UTILS } = global.MY1_GLOBAL;

UTILS.queryObjAdd = (sitePath, fieldsObj) => {

    const parsedPathObj = url.parse(sitePath, true);

    const newSitePathQuery = querystring.stringify({
        ...parsedPathObj.query,
        ...fieldsObj,
    });

    const newSitePath = [parsedPathObj.protocol, '//', parsedPathObj.host, parsedPathObj.pathname];

    newSitePathQuery && newSitePath.push(`?${newSitePathQuery}`); // eslint-disable-line no-unused-expressions
    parsedPathObj.hash && newSitePath.push(parsedPathObj.hash); // eslint-disable-line no-unused-expressions

    return newSitePath.join('');

};
