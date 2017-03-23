'use strict';

function _isValid(attachment) {
    if (typeof attachment !== 'object') return false;
    if (attachment.stub === true) return true;
    if (typeof attachment.content_type !== 'string') return false;
    if (Buffer.isBuffer(attachment.buffer)) return true;
    if (typeof attachment.value === 'string') return true;
    return false;
}

function _isNew(attachment) {
    return attachment.stub !== true;
}

function _length(attachment) {
    if (Buffer.isBuffer(attachment.buffer))
        return attachment.buffer.length;
    else
        return Buffer.byteLength(attachment.value);
}

function _extract(attachment, name) {
    const result = {
        content_type: attachment.content_type,
        filename: name
    };
    if (attachment.buffer)
        result.buffer = attachment.buffer;
    else
        result.value = attachment.value;
    return result;
}

function _follows(attachment) {
    return {
        follows: true,
        content_type: attachment.content_type,
        length: _length(attachment)
    };
}

function _stub(attachment) {
    return {
        stub: true,
        content_type: attachment.content_type
    };
}

const AttachmentParser = {};

AttachmentParser.clone = (attachments) => {
    if (!attachments) return;
    const result = {};
    for (const name of Object.keys(attachments)) {
        result[name] = Object.assign({}, attachments[name]);
    }
    return result;
};

AttachmentParser.extract = (attachments) => {
    if (!attachments) return [];
    const result = [];
    for (const name of Object.keys(attachments)) {
        const attachment = attachments[name];
        if (!_isValid(attachment))
            delete attachments[name];
        else if (_isNew(attachment)) {
            result.push(_extract(attachment, name));
            attachments[name] = _follows(attachment);
        }
    }
    return result;
};

AttachmentParser.sanitise = (attachments) => {
    if (!attachments) return;
    const clone = AttachmentParser.clone(attachments);
    for (const name of Object.keys(attachments)) {
        const attachment = attachments[name];
        if (!_isValid(attachment))
            delete clone[name];
        else if (_isNew(attachment)) {
            clone[name] = _stub(attachment);
        }
    }
    return clone;
};

module.exports = AttachmentParser;
