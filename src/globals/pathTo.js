const { resolve } = require('path');

const DOMAIN_NAME = process.env.DOMAIN_NAME;

const ROOT_DIR = resolve(__dirname, '..');

module.exports = {
    PATH_TO_MIDDLEWARES: `${ROOT_DIR}/middlewares`,
    PATH_TO_UTILS: `${ROOT_DIR}/utils`,
    PATH_TO_SERVICES: `${ROOT_DIR}/services`,
    PATH_TO_HANDLER: `${ROOT_DIR}/requestHandler`,
    PATH_TO_APIV1: `${ROOT_DIR}/apiv1`,
    PATH_TO_TEMP: `/var/www/${DOMAIN_NAME}/wp-content/temp`,
    PATH_TO_SITE: `/var/www/${DOMAIN_NAME}`,
    PATH_TO_BUNDLE: `/var/www/${DOMAIN_NAME}/wp-content/public`,
};
