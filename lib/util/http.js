'use strict';
const request = require('request');

const BodyParser = require('./body-parser');

const Http = {};

Http.rawRequest = (options, callback) => {
    request(options, callback);
};

Http.request = (options, callback) => {
    Http.rawRequest(Object.assign({ json: true }, options), callback);
};

Http.multipart = (options, data, callback) => {
    const parsed = BodyParser.forHttp(data);
    Http.request(Object.assign({}, options, parsed), callback);
};

function _dbUrl(dbUrl) {
    return dbUrl || 'http://localhost:5984';
}

function _dbName(dbName) {
    const env = process.env.NODE_ENV || 'development';
    if (env !== 'production') return dbName + '-' + env;
    return dbName;
}

function _couchUrl(dbUrl, dbName, ...breadcrumbs) {
    const url = [_dbUrl(dbUrl), _dbName(dbName)].concat(breadcrumbs).join('/');
    if (!dbName)
        throw new Error('Db name not provided. ' + url);
    if (breadcrumbs.filter(part => !part).length > 0)
        throw new Error('Invalid url. ' + url);
    return url;
}

Http.urlTo = (Model, ...breadcrumbs) => {
    return _couchUrl(Model.dbUrl, Model.dbName, ...breadcrumbs);
}

Http.urlToFixed = (doc, ...breadcrumbs) => {
    return Http.urlTo(doc.constructor, doc.getId(), ...breadcrumbs);
}

module.exports = Http;
