/* eslint-disable no-unused-vars, no-undef */

if (window && window.IS_SERVER) {

    const ROOTDIR = global.ROOTDIR = __dirname;

}

const DOMAIN_NAME = 'my-own-site.cot';

const ERRORS = {
    '': 'some problem with server',
    770000: 'unknown error',
    770041: 'Some problem with parse stream body',
    770042: 'Bad request',
    770050: 'unknown error with MySql',
    770071: 'problem with parse terms request',
};

module.exports = {
    PORT: process.env.PORT,
    PATH_TO_SHARED: `${ROOTDIR}/client/shared`,
    PATH_TO_SCREENS: `${ROOTDIR}/client/screens`,
    PATH_TO_TEMPLATES: `${ROOTDIR}/client/shared/templates`,
    PATH_TO_MIDDLEWARES: `${ROOTDIR}/middlewares`,
    PATH_TO_SITE: `/var/www/${DOMAIN_NAME}`,
    PATH_TO_BUNDLE: `/var/www/${DOMAIN_NAME}/public`,
    PATH_TO_PUBLIC: '/public/',
    PATH_TO_UPLOADS: '/uploads',
    PATH_TO_UTILS: `${ROOTDIR}/utils`,
    PATH_TO_WORKS: `${ROOTDIR}/repeatWork`,
    PATH_TO_APIV1: `${ROOTDIR}/apiv1`,
    ROOTDIR,
    RELOAD_FILES_STORAGE: {},
    DOMAIN_NAME,
    UTILS: {},
    APIV1: {},
    ERRORS,
};
