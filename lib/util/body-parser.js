'use strict';
const AttachmentParser = require('./attachment-parser');

function _multipart(body, atts) {
    const result = {
        _body: {
            content_type: 'application/json',
            value: JSON.stringify(body)
        }
    };
    for (let i = 0; i < atts.length; i++) {
        result['att-' + i] = atts[i];
    }
    return result;
}

const BodyParser = {};

BodyParser.clone = (body) => {
    return Object.assign({}, body, {
        _attachments: AttachmentParser.clone(body._attachments)
    });
};

BodyParser.parse = (body) => {
    const clone = BodyParser.clone(body);
    const result = {
        data: clone,
        multipart: false
    };
    const atts = AttachmentParser.extract(clone._attachments);
    if (atts.length > 0) {
        result.data = _multipart(clone, atts);
        result.multipart = true;
    }
    return result;
};

BodyParser.sanitise = (body) => {
    return Object.assign({}, body, {
        _attachments: AttachmentParser.sanitise(body._attachments)
    });
};

module.exports = BodyParser;
