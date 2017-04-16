'use strict';
const artisan = require('json-artisan');

const AttachmentMap = require('../util/attachment-map');

function _strip(data = {}) {
    const result = Object.assign({}, data);
    delete result._id;
    delete result._rev;
    delete result._attachments;
    return result;
}

function _clean(data, attachments) {
    const body = _strip(data);
    body._attachments = attachments;
    return body;
}

function _multipart(body, parts) {
    const multipart = [{
        'content-type': 'application/json',
        body: JSON.stringify(body)
    }];
    multipart.push(...parts);
    return multipart;
}

class Body {
    constructor(data, attachments) {
        this.data = data;
        this.attachments = attachments;
    }

    static create(body) {
        if (typeof body !== 'object')
            return new Body(body);
        if ('_attachments' in body && body._attachments === undefined)
            return new Body(_strip(body));
        return new Body(_strip(body), AttachmentMap.extract(body._attachments));
    }

    extend(body = {}) {
        const result = artisan({}, _strip(body), this.data);
        if (this.attachments === undefined)
            return new Body(result);
        else
            return new Body(result, AttachmentMap.extend(body._attachments, this.attachments));
    }

    isValid() {
        if (typeof this.data !== 'object') return false;
        if (!AttachmentMap.isValid(this.attachments)) return false;
        return true;
    }

    forDoc() {
        return _clean(this.data, AttachmentMap.forDoc(this.attachments));
    }

    forHttp(rev) {
        const body = _clean(this.data, AttachmentMap.forHttp(this.attachments));
        body._rev = rev;
        const parts = AttachmentMap.forMultipart(this.attachments);
        if (parts.length > 0)
            return { multipart: _multipart(body, parts) };
        else
            return { body };
    }
}

module.exports = Body;
