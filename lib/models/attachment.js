'use strict';

const typeAttrs = ['content_type', 'contenttype', 'content-type'];

function _getType(data) {
    for (const key of Object.keys(data)) {
        if (typeAttrs.indexOf(key.toLowerCase()) > -1) return data[key];
    }
}

class Attachment {
    constructor(attachment = {}) {
        if (typeof attachment === 'object') {
            this.stub = attachment.stub;
            this.type = _getType(attachment);
            this.body = attachment.body;
            this._length = attachment.length;
        }
    }

    isValid() {
        if (typeof this.type !== 'string') return false;
        if (this._length !== undefined && typeof this._length !== 'number') return false;
        if (this.stub) return true;
        if (typeof this.body === 'string') return true;
        if (Buffer.isBuffer(this.body)) return true;
        return false;
    }

    getLength() {
        if (this._length !== undefined) return this._length;
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

    forMultipart() {
        return {
            'content-type': this.type,
            body: this.body
        };
    }
}

module.exports = Attachment;
