'use strict';

const typeAttrs = ['content_type', 'contentType', 'content-type', 'Content-Type', 'ContentType'];

function _getType(data) {
    for (const typeAttr of typeAttrs) {
        if (typeAttr in data) return data[typeAttr];
    }
}

class Attachment {
    constructor(data = {}) {
        this.stub = data.stub;
        this.type = _getType(data);
        this.body = data.body;
        this._length = data.length;
    }

    static forDoc(attachments) {
        const result = {};
        for (const attname of Object.keys(attachments)) {
            result[attname] = attachments[attname].toStub();
        }
        return result;
    }

    static forHttp(attachments) {
        const result = {};
        for (const attname of Object.keys(attachments)) {
            result[attname] = attachments[attname].forHttp();
        }
        return result;
    }

    static follows(attachments) {
        return Object.values(attachments)
            .filter(attachment => !attachment.stub)
            .map(attachment => attachment.toMultipart());
    }

    isValid() {
        if (typeof this.type !== 'string') return false;
        if (this.stub) return true;
        if (typeof this.body === 'string') return true;
        if (Buffer.isBuffer(this.body)) return true;
        return false;
    }

    getLength() {
        if (this._length) return this._length;
        if (typeof this.body === 'string') return Buffer.byteLength(this.body);
        if (Buffer.isBuffer(this.body)) return this.body.length;
        return 0;
    }

    forHttp() {
        return (this.stub ? this.toStub() : this.toFollows());
    }

    toStub() {
        return {
            stub: true,
            content_type: this.type,
            length: this.getLength()
        };
    }

    toFollows() {
        return {
            follows: true,
            content_type: this.type,
            length: this.getLength()
        };
    }

    toMultipart() {
        return {
            'content-type': this.type,
            body: this.body
        };
    }
}

module.exports = Attachment;
