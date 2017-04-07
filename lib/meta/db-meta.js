'use strict';
const Http = require('../util/http');
const Res = require('../util/res');

const DbMeta = {};

DbMeta.head = (Model, callback) => {
    const options = {
        method: 'HEAD',
        url: Http.urlTo(Model)
    };
    Http.request(options, Res.err('db', callback));
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
    const options = {
        method: 'DELETE',
        url: Http.urlTo(Model)
    };
    Http.request(options, Res.err('db', (err) => {
        if (err && err.name !== 'no_db_file')
            callback(err);
        else
            callback(); // success
    }));
};

DbMeta.create = (Model, callback) => {
    const options = {
        method: 'PUT',
        url: Http.urlTo(Model)
    };
    Http.request(options, Res.err('db', (err) => {
        if (err && err.name !== 'db_already_exists')
            callback(err);
        else
            callback(); // success
    }));
};

module.exports = DbMeta;
