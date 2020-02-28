const { join } = require('path');

const { PATH_TO_UTILS } = require(join(__dirname, '..', 'globals', 'pathTo'));
const queryObjAddFields = require(join(PATH_TO_UTILS, 'queryObjAddFields'));

const redirectBack = function({ req, res, elements }) {

    return () => {

        res.writeHead(302, {
            Location: queryObjAddFields(req.headers.referer, elements || {}),
        });
        res.end();

    };

};

module.exports = redirectBack;
