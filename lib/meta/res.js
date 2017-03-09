'use strict';
const Err = require('../err');

function _findRev({ headers, body }) {
    // couchdb puts our rev in the format '"etag"' so we need to
    // strip erroneous quotes
    if (typeof body === 'object' && (body.rev || body._rev))
        return body.rev || body._rev;
    if (typeof headers === 'object' && headers.etag)
        return headers.etag.replace(/"/g, '');
}

const Res = (scope, callback) => (error, response) => {
    const err = Err.make(scope, error, response);
    const rev = _findRev(response);
    callback(err, response.body, rev);
};

module.exports = Res;
