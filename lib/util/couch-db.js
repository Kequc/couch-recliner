'use strict';
const request = require('request');

const CouchDb = {};

CouchDb.put = (path, opt, callback) => {
    CouchDb.request('PUT', path, opt, callback);
};

CouchDb.get = (path, opt, callback) => {
    CouchDb.request('GET', path, opt, callback);
};

CouchDb.head = (path, opt, callback) => {
    CouchDb.request('HEAD', path, opt, callback);
};

CouchDb.delete = (path, opt, callback) => {
    CouchDb.request('DELETE', path, opt, callback);
};

CouchDb.request = (method, path, opt, callback) => {
    request(CouchDb.requestBuilder(method, path, opt), (err, res, body) => {
        let parsed;
        try { parsed = JSON.parse(body); } catch(e) { parsed = body; }
        callback(err || _error(res, parsed), parsed);
    });
};

function _error(res, parsed) {
    const statusCode = res.statusCode || 500;
    if (statusCode >= 200 && statusCode < 400)
        return;
    const err = new Error(typeof parsed === 'string' ? parsed : (parsed.message || parsed.reason || parsed.error));
    err.statusCode = statusCode;
    return err;
}

CouchDb.requestBuilder = (method, path, opt = {}) => {
    const req = {
        method,
        url: path.join('/'),
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
