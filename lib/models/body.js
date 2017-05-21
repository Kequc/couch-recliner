'use strict';
const artisan = require('json-artisan');

const AttachmentMap = require('../util/attachment-map');

function _multipart(body, parts) {
    const multipart = [{
        'content-type': 'application/json',
        body: JSON.stringify(body)
    }];
    multipart.push(...parts);
    return multipart;
}

class Body {
    constructor(data) {
        this.data = data;
    }

    parsed() {
        const body = artisan({}, this.extends, this.data);
        delete body._id;
        delete body._rev;
        return body;
    }

    isValid() {
        if (typeof this.data !== 'object') return false;
        if (!AttachmentMap.isValid(this.data._attachments)) return false;
        if (this.extends !== undefined) {
            if (typeof this.extends !== 'object') return false;
            if (!AttachmentMap.isValid(this.extends._attachments)) return false;
        }
        return true;
    }

    forDoc() {
        const body = this.parsed();
        if ('_attachments' in body)
            body._attachments = AttachmentMap.forDoc(body._attachments);
        return body;
    }

    forHttp(rev) {
        const body = this.parsed();
        body._rev = rev;
        if ('_attachments' in body) {
            const parts = AttachmentMap.forMultipart(body._attachments);
            body._attachments = AttachmentMap.forHttp(body._attachments);
            if (parts.length > 0)
                return { multipart: _multipart(body, parts) };
        }
        return { body };
    }
}

module.exports = Body;
