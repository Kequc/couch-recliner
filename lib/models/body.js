'use strict';
const artisan = require('json-artisan');

const Attachment = require('./attachment');

function _extract(attachments = {}) {
    let _attachments = {};
    for (const attname of Object.keys(attachments)) {
        const attachment = new Attachment(attachments[attname]);
        if (attachment.isValid())
            _attachments[attname] = attachment;
    }
    return _attachments;
}

function _strip(data = {}) {
    return Object.assign({}, data, { _attachments: undefined });
}

function _multipart(body, follows) {
    const multipart = [{
        'content-type': 'application/json',
        body: JSON.stringify(body)
    }];
    for (const follow of follows) {
        multipart.push(follow);
    }
    return multipart;
}

function _clean(data, _attachments, _rev) {
    const body = Object.assign({}, data, { _attachments, _rev });
    if (body._rev === undefined) delete body._rev;
    if (body._attachments === undefined) delete body._attachments;
    return body;
}

class Body {
    constructor(id, data = {}) {
        this.attachments = _extract(data._attachments);
        this.data = artisan({}, _strip(data));
        this.data._id = id;
    }

    extend(data = {}) {
        if (data._attachments !== undefined) {
            for (const attname of Object.keys(data._attachments)) {
                if (data._attachments[attname] === undefined)
                    delete this.attachments[attname];
            }
            Object.assign(this.attachments, _extract(data._attachments));
        }
        else if ('_attachments' in data)
            this.attachments = {};
        this.data = artisan(this.data, _strip(data));
        return this;
    }

    forDoc(rev) {
        return _clean(this.data, Attachment.forDoc(this.attachments), rev);
    }

    forHttp(rev) {
        const body = _clean(this.data, Attachment.forHttp(this.attachments), rev);
        delete body._id;
        const follows = Attachment.follows(this.attachments);
        if (follows.length > 0)
            return { multipart: _multipart(body, follows) };
        else
            return { body };
    }
}

module.exports = Body;
