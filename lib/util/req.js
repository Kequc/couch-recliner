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

function _payload(options) {
    if (options.payload === undefined) return { body: options.body };
    const body = Object.assign({}, options.payload);
    delete body._rev;
    delete body._id;
    if ('rev' in options) body._rev = options.rev;
    return BodyParser.forHttp(body);
}

Req.head = options => _general('HEAD', options);
Req.get = options => _general('GET', options);
Req.delete = options => _general('DELETE', options);
Req.put = options => Object.assign(_general('PUT', options), _payload(options));
Req.post = options => Object.assign(_general('POST', options), _payload(options));

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
