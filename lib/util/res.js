'use strict';
const Err = require('./err');

const Res = {};

Res.full = (scope, callback) => (error, response) => {
    const err = Err.make(scope, error, response);
    callback(err, response || {});
};

Res.findRev = (headers) => {
    // couchdb puts our rev in the format '"etag"' so we need to
    // strip erroneous quotes
    if (typeof headers === 'object' && headers.etag) {
        return headers.etag.replace(/"/g, '');
    }
};

Res.err = (scope, callback) => Res.full(scope, (err) => {
    callback(err);
});

Res.headers = (scope, callback) => Res.full(scope, (err, { headers }) => {
    callback(err, headers);
});

Res.body = (scope, callback) => Res.full(scope, (err, { body }) => {
    callback(err, body);
});

module.exports = Res;
