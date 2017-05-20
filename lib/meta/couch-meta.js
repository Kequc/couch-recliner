'use strict';
const Http = require('../util/http');
const Req = require('../util/req');
const Res = require('../util/res');

const CouchMeta = {};

CouchMeta.nextId = (couch, callback) => {
    if (couch._ids.length <= 0) {
        const url = couch.urlTo('_uuids');
        const count = couch.CACHE_IDS_COUNT;
        Http.request(Req.get({ url, qs: { count } }), Res.body('couch', (err, { uuids }) => {
            if (err)
                callback(err);
            else {
                couch._ids = uuids;
                callback(undefined, couch._ids.shift()); // success
            }
        }));
    }
    else
        callback(undefined, couch._ids.shift());
};

module.exports = CouchMeta;
