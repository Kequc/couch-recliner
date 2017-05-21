'use strict';
const Attachment = require('../models/attachment');

function _keyValue(attachments = {}, parser) {
    const result = {};
    for (const attname of Object.keys(attachments)) {
        result[attname] = parser(new Attachment(attachments[attname]));
    }
    return result;
}

const AttachmentMap = {};

AttachmentMap.isValid = (attachments = {}) => {
    for (const attname of Object.keys(attachments)) {
        if (attachments[attname] !== undefined) {
            const attachment = new Attachment(attachments[attname]);
            if (!attachment.isValid()) return false;
        }
    }
    return true;
};

AttachmentMap.forDoc = (attachments) => {
    return _keyValue(attachments, value => value.toStub());
};

AttachmentMap.forHttp = (attachments) => {
    return _keyValue(attachments, value => value.forHttp());
};

AttachmentMap.forMultipart = (attachments = {}) => {
    return Object.keys(attachments)
        .map(attname => new Attachment(attachments[attname]))
        .filter(attachment => !attachment.stub)
        .map(attachment => attachment.forMultipart());
};

module.exports = AttachmentMap;
