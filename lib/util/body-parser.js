'use strict';
const artisan = require('json-artisan');

const Attachment = require('./attachment');

const DESIGN_PARAMS = ['counts', 'drilldown', 'group_sort', 'ranges', 'sort'];

function _sanitiseDesignParams(params) {
    const qs = Object.assign({}, params);
    for (const param of DESIGN_PARAMS) {
        if (param in qs)
            qs[param] = JSON.stringify(params[param]);
    }
    return qs;
}

const BodyParser = {};

function _strip(body = {}) {
    return Object.assign({}, body, { _attachments: undefined });
}

function _multipart(body, follows) {
    const multipart = [{
        'content-type': 'application/json',
        body: JSON.stringify(body)
    }];
    for (const attachment of follows) {
        multipart.push(attachment.toMultipart());
    }
    return multipart;
}

function _extract(body = {}, body2) {
    let _attachments = body._attachments || {};
    if (body2 && '_attachments' in body2 && body2._attachments === undefined)
        _attachments = {};
    else if (body2)
        _attachments = Object.assign({}, _attachments, body2._attachments || {});
    return Object.keys(_attachments)
        .map(attname => new Attachment(attname, _attachments[attname]))
        .filter(attachment => attachment.isValid());
}

function _render(attachments, method) {
    if (attachments.length < 1) return undefined;
    const result = {};
    for (const attachment of attachments) {
        result[attachment.attname] = attachment[method]();
    }
    return result;
}

BodyParser.extend = (body, body2) => {
    const attachments = _extract(body, body2);
    return Object.assign(artisan({}, _strip(body), _strip(body2)), {
        _attachments: _render(attachments, 'toObject')
    });
};

BodyParser.forHttp = (body) => {
    const attachments = _extract(body);
    const result = Object.assign({}, body, {
        _attachments: _render(attachments, 'forHttp')
    });
    const follows = attachments.filter(attachment => !attachment.stub);
    if (follows.length > 0)
        return { multipart: _multipart(result, follows) };
    else
        return { body: result };
};

BodyParser.forDoc = (body) => {
    const attachments = _extract(body);
    return Object.assign({}, body, {
        _attachments: _render(attachments, 'toStub')
    });
};

module.exports = BodyParser;
