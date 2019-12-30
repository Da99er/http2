const { UTILS } = global.MY1_GLOBAL;

UTILS.redirectBack = function({ req, res, elements }) {

    return () => {

        res.writeHead(302, {
            Location: UTILS.queryObjAddFields(req.headers.referer, elements || {}),
        });
        res.end();

    };

};
