'use strict';
const Http = require('../util/http');
const Req = require('../util/req');
const Res = require('../util/res');

const DbMeta = {};

DbMeta.head = (Model, callback) => {
    const url = Req.urlTo(Model);
    Http.request(Req.head({ url }), Res.err('db', callback));
};

DbMeta.reset = (Model, callback) => {
    DbMeta.destroy(Model, (err) => {
        if (err)
            callback(err);
        else
            DbMeta.create(Model, callback);
    });
};

DbMeta.destroy = (Model, callback) => {
    const url = Req.urlTo(Model);
    Http.request(Req.delete({ url }), Res.err('db', (err) => {
        if (err && err.name !== 'not_found')
            callback(err);
        else
            callback(); // success
    }));
};

DbMeta.create = (Model, callback) => {
    const url = Req.urlTo(Model);
    Http.request(Req.put({ url }), Res.err('db', (err) => {
        if (err && err.name !== 'db_already_exists')
            callback(err);
        else
            callback(); // success
    }));
};

module.exports = DbMeta;
