'use strict';

const typeAttrs = ['content_type', 'contentType', 'content-type', 'Content-Type', 'ContentType'];

function _getType(data) {
    for (const typeAttr of typeAttrs) {
        if (typeAttr in data) return data[typeAttr];
    }
}

class Attachment {
    constructor(attname, data = {}) {
        this.stub = data.stub;
        this.type = _getType(data);
        this.body = data.body;
        this.attname = attname;
        this._length = data.length;
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

    toObject() {
        return {
            stub: this.stub,
            content_type: this.type,
            body: this.body,
            length: this.getLength()
        };
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

    forHttp() {
        return (this.stub ? this.toStub() : this.toFollows());
    }

    toMultipart() {
        return {
            'content-type': this.type,
            body: this.body
        };
    }
}

module.exports = Attachment;
