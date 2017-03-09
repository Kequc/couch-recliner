'use strict';
const needle = require('needle');

const Res = require('./res');

const DbMeta = {};

DbMeta.head = (Model, callback) => {
    const url = Model.db.urlTo();
    needle.request('HEAD', url, {}, { json: true }, Res('db', callback));
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
    const url = Model.db.urlTo();
    needle.request('DELETE', url, {}, { json: true }, Res('db', callback));
};

DbMeta.create = (Model, callback) => {
    const url = Model.db.urlTo();
    needle.request('PUT', url, {}, { json: true }, Res('db', callback));
};

module.exports = DbMeta;
