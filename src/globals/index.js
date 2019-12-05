/* eslint-disable no-unused-vars, no-undef */

const ERRORS = require('./errors');
const PATH_TO = require('./path-to');
const SERVER = require('./server');

const DOMAIN_NAME = process.env.DOMAIN_NAME;

module.exports = {
    DOMAIN_NAME,
    ROOTDIR,
    ...ERRORS,
    ...PATH_TO,
    ...SERVER,
};
