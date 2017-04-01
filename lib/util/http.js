'use strict';
const request = require('request');

const BodyParser = require('./body-parser');

const Http = {};

Http.rawRequest = (options, callback) => {
    request(Object.assign({ json: true }, options), callback);
};

Http.multipartRequest = (options, data, callback) => {
    const parsed = BodyParser.forHttp(data);
    Http.rawRequest(Object.assign({}, options, parsed), callback);
};

function _dbUrl(dbUrl) {
    return dbUrl || 'http://localhost:5984';
}

function _dbName(dbName) {
    const env = process.env.NODE_ENV || 'development';
    if (env !== 'production') return dbName + '-' + env;
    return dbName;
}

Http.couchUrl = (dbUrl, dbName, breadcrumbs) => {
    const url = [_dbUrl(dbUrl), _dbName(dbName)].concat(breadcrumbs).join('/');
    if (!dbName)
        throw new Error('Db name not provided. ' + url);
    if (breadcrumbs.filter(part => !part).length > 0)
        throw new Error('Invalid url. ' + url);
    return url;
};

module.exports = Http;
