'use strict';
const Attachment = require('../models/attachment');

function _keyValue(attachments = {}, parser) {
    const result = {};
    for (const attname of Object.keys(attachments)) {
        result[attname] = parser(attachments[attname]);
    }
    return result;
}

function _extract(attachment) {
    if (attachment === undefined) return undefined;
    if (!(attachment instanceof Attachment)) return new Attachment(attachment);
    return attachment;
}

const AttachmentMap = {};

AttachmentMap.extract = (_attachments = {}) => {
    return _keyValue(_attachments, _extract);
};

AttachmentMap.forDoc = (attachments) => {
    return _keyValue(attachments, value => value.toStub());
};

AttachmentMap.forHttp = (attachments) => {
    return _keyValue(attachments, value => value.forHttp());
};

AttachmentMap.extend = (_attachments, attachments) => {
    const result = AttachmentMap.extract(_attachments);
    for (const attname of Object.keys(attachments)) {
        if (attachments[attname] === undefined)
            delete result[attname];
        else
            result[attname] = attachments[attname];
    }
    return result;
};

AttachmentMap.isValid = (attachments = {}) => {
    for (const attachment of Object.values(attachments)) {
        if (attachment !== undefined && !attachment.isValid()) return false;
    }
    return true;
};

AttachmentMap.forMultipart = (attachments = {}) => {
    return Object.values(attachments)
        .filter(attachment => !attachment.stub)
        .map(attachment => attachment.forMultipart());
};

module.exports = AttachmentMap;
