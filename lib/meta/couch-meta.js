'use strict';
const Http = require('../util/http');
const Req = require('../util/req');
const Res = require('../util/res');

const CouchMeta = {};

CouchMeta.uuid = (couch, count, callback) => {
    const url = couch.getUrl('_uuids');
    Http.request(Req.get({ url, qs: { count } }), Res.body('couch', (err, body) => {
        if (err)
            callback(err);
        else
            callback(undefined, body.uuids) // success
    }));
};

module.exports = CouchMeta;
