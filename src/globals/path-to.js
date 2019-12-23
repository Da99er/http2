/* eslint-disable no-undef */

const DOMAIN_NAME = process.env.DOMAIN_NAME;

module.exports = {
    PATH_TO_MIDDLEWARES: `${ROOTDIR}/middlewares`,
    PATH_TO_SERVER_HELPERS: `${ROOTDIR}/helpers`,
    PATH_TO_WORKS: `${ROOTDIR}/repeatWorks`,
    PATH_TO_APIV1: `${ROOTDIR}/apiv1`,
    PATH_TO_CLIENT: '/home/vadim/Documents/react-client/src',
    PATH_TO_TEMP: '/home/vadim/Documents/react-client/src/temp',
    PATH_TO_SITE: `/var/www/${DOMAIN_NAME}`,
    PATH_TO_BUNDLE: `/var/www/${DOMAIN_NAME}/wp-content/public`,
};
