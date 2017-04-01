'use strict';
const AttachmentParser = require('./attachment-parser');

function _multipart(body, parts) {
    return [{
        'content-type': 'application/json',
        body: JSON.stringify(body)
    }].concat(parts);
}

function _sanitiseDesignParams(params) {
    const qs = Object.assign({}, params);
    for (const key of ['counts', 'drilldown', 'group_sort', 'ranges', 'sort']) {
        if (qs[key])
            qs[key] = JSON.stringify(qs[key]);
    }
    return qs;
}

const BodyParser = {};

BodyParser.forHttp = (body) => {
    const attas = AttachmentParser.toValidAttas(body._attachments);
    const clone = Object.assign({}, body, {
        _attachments: AttachmentParser.insert(attas)
    });
    const parts = AttachmentParser.toMultiparts(attas);
    if (Object.keys(parts).length > 0) {
        return { multipart: _multipart(clone, parts) }
    }
    return { body: clone };
};

BodyParser.forDoc = (body) => {
    return Object.assign({}, body, {
        _attachments: AttachmentParser.toValidStubs(body._attachments)
    });
};

module.exports = BodyParser;
