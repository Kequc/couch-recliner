'use strict';
const AttachmentParser = require('./attachment-parser');

function _multipart(body, parts) {
    return Object.assign({
        _body: {
            content_type: 'application/json',
            value: JSON.stringify(body)
        }
    }, parts);
}

const BodyParser = {};

BodyParser.parse = (body) => {
    const clone = Object.assign({}, body);
    const attachments = AttachmentParser.extract(body._attachments);
    clone._attachments = AttachmentParser.insert(attachments);
    const parts = AttachmentParser.multiparts(attachments);
    if (Object.keys(parts).length > 0) {
        return {
            data: _multipart(clone, parts),
            multipart: true
        };
    } else {
        return {
            data: clone,
            multipart: false
        };
    }
};

BodyParser.sanitise = (body) => {
    return Object.assign({}, body, {
        _attachments: AttachmentParser.sanitise(body._attachments)
    });
};

module.exports = BodyParser;
