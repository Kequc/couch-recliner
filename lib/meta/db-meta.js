'use strict';
const Res = require('../util/res');
const Http = require('../util/http');

const DbMeta = {};

DbMeta.head = (Model, callback) => {
    const options = {
        method: 'HEAD',
        url: Model.urlTo()
    };
    Http.rawRequest(options, Res.err('db', callback));
};

DbMeta.reset = (Model, callback) => {
    DbMeta.destroy(Model, (err) => {
        if (err && err.name !== 'no_db_file')
            callback(err);
        else
            DbMeta.create(Model, callback);
    });
};

DbMeta.destroy = (Model, callback) => {
    const options = {
        method: 'DELETE',
        url: Model.urlTo()
    };
    Http.rawRequest(options, Res.err('db', callback));
};

DbMeta.create = (Model, callback) => {
    const options = {
        method: 'PUT',
        url: Model.urlTo()
    };
    Http.rawRequest(options, Res.err('db', callback));
};

module.exports = DbMeta;
