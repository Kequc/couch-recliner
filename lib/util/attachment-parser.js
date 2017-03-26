'use strict';
const Attachment = require('./attachment');

const AttachmentParser = {};

AttachmentParser.sanitise = (attmap) => {
    const attachments = AttachmentParser.extract(attmap);
    const result = {};
    for (const attachment of attachments) {
        result[attachment.attname] = attachment.toStub();
    }
    return result;
};

AttachmentParser.extract = (attmap = {}) => {
    return Object.keys(attmap)
        .map(name => new Attachment(name, attmap[name]))
        .filter(attachment => attachment.isValid());
};

AttachmentParser.insert = (attachments) => {
    const result = {};
    for (const attachment of attachments) {
        if (attachment.stub)
            result[attachment.attname] = attachment.toStub();
        else
            result[attachment.attname] = attachment.toFollows();
    }
    return result;
};

AttachmentParser.multiparts = (attachments) => {
    const result = {};
    let index = 0;
    for (const attachment of attachments) {
        if (!attachment.stub) {
            result['att-' + index] = attachment.toMultipart();
            index++;
        }
    }
    return result;
};

module.exports = AttachmentParser;
