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

function _dbName(dbName) {
    if (!dbName)
        throw new Error('Db name not provided. ' + url);
    const env = process.env.NODE_ENV || 'development';
    if (env !== 'production') return dbName + '-' + env;
    return dbName;
}

Http.urlTo = (Model, ...breadcrumbs) => {
    return Model.couch.getUrl(_dbName(Model.dbName), ...breadcrumbs);
};

Http.urlToFixed = (doc, ...breadcrumbs) => {
    return Http.urlTo(doc.constructor, doc.id, ...breadcrumbs);
};

module.exports = Http;
