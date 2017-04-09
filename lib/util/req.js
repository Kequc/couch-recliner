'use strict';
const BodyParser = require('./body-parser');

const Req = {};

function _general(method, options) {
    return {
        method,
        url: options.url,
        qs: options.qs
    };
}

Req.head = (options) => {
    return _general('HEAD', options);
};

Req.get = (options) => {
    return _general('GET', options);
};

Req.putRaw = (options) => {
    return Object.assign(_general('PUT', options), { body: options.payload });
};

Req.put = (options) => {
    return Object.assign(_general('PUT', options), BodyParser.forHttp(options.payload));
};

Req.postRaw = (options) => {
    return Object.assign(_general('POST', options), { body: options.payload });
};

Req.post = (options) => {
    return Object.assign(_general('POST', options), BodyParser.forHttp(options.payload));
};

Req.delete = (options) => {
    return _general('DELETE', options);
};

function _dbName(dbName) {
    if (!dbName)
        throw new Error('Db name not provided.');
    const env = process.env.NODE_ENV || 'development';
    if (env !== 'production') return dbName + '-' + env;
    return dbName;
}

Req.urlTo = (Model, ...breadcrumbs) => {
    return Model.couch.urlTo(_dbName(Model.dbName), ...breadcrumbs);
};

Req.urlToFixed = (doc, ...breadcrumbs) => {
    return Req.urlTo(doc.constructor, doc.id, ...breadcrumbs);
};

module.exports = Req;
