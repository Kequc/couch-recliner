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

function _clean(data, _attachments, _rev, _id) {
    const body = Object.assign({}, data, { _attachments, _rev, _id });
    if (body._rev === undefined) delete body._rev;
    if (body._id === undefined) delete body._id;
    return body;
}

function _multipart(body, follows) {
    const multipart = [{
        'content-type': 'application/json',
        body: JSON.stringify(body)
    }];
    multipart.push(...follows);
    return multipart;
}

class Body {
    constructor(data, attachments) {
        this.data = data;
        this.attachments = attachments;
    }

    static create(_body) {
        if (typeof _body !== 'object')
            return new Body(_body);
        if ('_attachments' in _body && _body._attachments === undefined)
            return new Body(_strip(_body));
        return new Body(_strip(_body), AttachmentMap.extract(_body._attachments));
    }

    extend(_body = {}) {
        const result = artisan({}, _strip(_body), this.data);
        if (this.attachments === undefined)
            return new Body(result);
        else
            return new Body(result, AttachmentMap.extend(_body._attachments, this.attachments));
    }

    isValid() {
        if (typeof this.data !== 'object') return false;
        if (!AttachmentMap.isValid(this.attachments)) return false;
        return true;
    }

    forDoc(id, rev) {
        return _clean(this.data, AttachmentMap.forDoc(this.attachments), rev, id);
    }

    forHttp(rev) {
        const body = _clean(this.data, AttachmentMap.forHttp(this.attachments), rev);
        const follows = AttachmentMap.forMultipart(this.attachments);
        if (follows.length > 0)
            return { multipart: _multipart(body, follows) };
        else
            return { body };
    }
}

module.exports = Body;
