'use strict';
const request = require('request');

const CouchDb = {};

CouchDb.put = (breadcrumbs, opt, callback) => {
    CouchDb.request('PUT', breadcrumbs, opt, callback);
};

CouchDb.get = (breadcrumbs, opt, callback) => {
    CouchDb.request('GET', breadcrumbs, opt, callback);
};

CouchDb.head = (breadcrumbs, opt, callback) => {
    CouchDb.request('HEAD', breadcrumbs, opt, callback);
};

CouchDb.delete = (breadcrumbs, opt, callback) => {
    CouchDb.request('DELETE', breadcrumbs, opt, callback);
};

CouchDb.request = (method, breadcrumbs, opt, callback) => {
    request(CouchDb.requestBuilder(method, breadcrumbs, opt), (err, res, body) => {
        let parsed;
        try { parsed = JSON.parse(body); } catch(e) { parsed = body; }
        callback(CouchDb.getError(err, res, parsed), parsed, CouchDb.getRev(res, parsed));
    });
};

CouchDb.getRev = (res, parsed) => {
    // couchdb puts our rev in the format '"etag"' so we need to
    // strip erroneous quotes
    if (res.etag && (typeof parsed !== 'object' || (!parsed.rev && !parsed._rev)))
        return res.etag.replace(/"/g, '');
    else if (typeof parsed === 'object')
        return parsed.rev || parsed._rev;
};

CouchDb.getError = (err, res, parsed) => {
    const statusCode = res.statusCode || 500;
    if (err) {
        err.statusCode = err.statusCode || statusCode;
        return err;
    }
    if (statusCode >= 200 && statusCode < 400)
        return;
    const message = parsed.message || parsed.reason || parsed.error;
    err = new Error(typeof parsed === 'string' ? parsed : message);
    err.statusCode = statusCode;
    return err;
}

CouchDb.requestBuilder = (method, breadcrumbs, opt = {}) => {
    const req = {
        method,
        url: breadcrumbs.join('/'),
        headers: Object.assign({
            'content-type': 'application/json',
            accept: 'application/json'
        }, opt.headers),
        qs: Object.assign({}, opt.qs)
    };

    for (const key of ['startkey', 'endkey', 'key', 'keys']) {
        if (req.qs[key])
            req.qs[key] = JSON.stringify(req.qs[key]);
    }

    if (['POST', 'PUT'].indexOf(method) < 0)
        return req;

    if (opt.attachments) {
        req.headers['content-type'] = 'multipart/related';
        req.multipart = [];
        const body = Object.assign({ _attachments: {} }, opt.body);
        for(const attachment of opt.attachments) {
            body._attachments[attachment.name] = {
                follows: true,
                length: _length(attachment.data),
                content_type: attachment.contentType
            };
            req.multipart.push({ body: attachment.data });
        }
        req.multipart.unshift({
            'content-type': 'application/json',
            body: JSON.stringify(body)
        });
    }
    else req.json = opt.body;

    return req;
};

function _length(data) {
    return (Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data));
}

module.exports = CouchDb;
