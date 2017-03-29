'use strict';
const Attachment = require('./attachment');

const AttachmentParser = {};

AttachmentParser.toValidStubs = (attmap) => {
    const attas = AttachmentParser.toValidAttas(attmap);
    const result = {};
    for (const atta of attas) {
        result[atta.attname] = atta.toStub();
    }
    return result;
};

AttachmentParser.toValidAttas = (attaMap = {}) => {
    return Object.keys(attaMap)
        .map(name => new Attachment(name, attaMap[name]))
        .filter(attachment => attachment.isValid());
};

AttachmentParser.insert = (attas) => {
    const result = {};
    for (const atta of attas) {
        if (atta.stub)
            result[atta.attname] = atta.toStub();
        else
            result[atta.attname] = atta.toFollows();
    }
    return result;
};

AttachmentParser.toMultiparts = (attas) => {
    return attas
        .filter(atta => !atta.stub)
        .map(atta => atta.toMultipart());
};

module.exports = AttachmentParser;
