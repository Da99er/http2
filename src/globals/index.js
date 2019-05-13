/* eslint-disable no-unused-vars, no-undef */
const { resolve } = require('path');

if (window && window.IS_SERVER) {

    const ROOTDIR = global.ROOTDIR = resolve(__dirname, '..');

}

const DOMAIN_NAME = 'my-own-site.cot';

const ERRORS = require('./errors');
const actions = require('./actions');

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
    SERVER_HELPERS: `${ROOTDIR}/serverHelpers`,
    PATH_TO_WORKS: `${ROOTDIR}/repeatWork`,
    PATH_TO_APIV1: `${ROOTDIR}/apiv1`,
    ROOTDIR,
    RELOAD_FILES_STORAGE: {},
    DOMAIN_NAME,
    UTILS: {},
    APIV1: {},
    ERRORS,
    actions,
};
