'use strict';
const Http = require('../util/http');
const Res = require('../util/res');

const CouchMeta = {};

CouchMeta.uuid = (couch, count, callback) => {
    const options = {
        method: 'GET',
        url: couch.getUrl('_uuids'),
        qs: { count }
    };
    Http.request(options, Res.body('couch', (err, body) => {
        if (err)
            callback(err);
        else
            callback(undefined, body.uuids) // success
    }));
};

module.exports = CouchMeta;
