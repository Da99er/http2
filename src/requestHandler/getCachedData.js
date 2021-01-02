const { join } = require('path');
const { FILE_STORAGE_RELOADED } = require(join(__dirname, '..', 'globals', 'events'));

const cacheStore = {};

const { emitter } = global.MY1_GLOBAL;

emitter.on(FILE_STORAGE_RELOADED, () => {

    Object.keys(cacheStore).forEach((page) => {

        delete cacheStore[page];

    });

});

function getCachedData(req) {

    const cookie = req.headers.cookie || '';

    if (cookie.includes('wordpress_logged_in') || cookie.includes('woocommerce_cart_hash')) {

        return null;

    }

    return cacheStore[req.urlParsed.href];

}

function setCachedPage(req, pageData) {

    const cookie = req.headers.cookie || '';

    if (cookie.includes('wordpress_logged_in') || cookie.includes('woocommerce_cart_hash')) {

        return null;

    }

    if (req.urlParsed.href === req.urlParsed.pathname) {

        cacheStore[req.urlParsed.pathname] = pageData;

    }

    return cacheStore;

}

module.exports = { getCachedData, setCachedPage };
