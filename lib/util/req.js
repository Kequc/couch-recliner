'use strict';
const Err = require('./err');

const Req = {};

Req.head = (options) => {
    return Object.assign({}, options, {
        method: 'HEAD'
    });
};

Req.get = (options) => {
    return Object.assign({}, options, {
        method: 'GET'
    });
};

Req.put = (options) => {
    return Object.assign({}, options, {
        method: 'PUT'
    });
};

Req.delete = (options) => {
    return Object.assign({}, options, {
        method: 'DELETE'
    });
};

function _dbName(dbName) {
    if (!dbName)
        throw new Error('Db name not provided. ' + url);
    const env = process.env.NODE_ENV || 'development';
    if (env !== 'production') return dbName + '-' + env;
    return dbName;
}

Req.urlTo = (Model, ...breadcrumbs) => {
    return Model.couch.getUrl(_dbName(Model.dbName), ...breadcrumbs);
};

Req.urlToFixed = (doc, ...breadcrumbs) => {
    return Req.urlTo(doc.constructor, doc.id, ...breadcrumbs);
};

module.exports = Req;
