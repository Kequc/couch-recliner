'use strict';

class Attachment {
    constructor(attname, data = {}) {
        this.stub = data.stub;
        this.content_type = data.content_type;
        this.value = data.value;
        this.buffer = data.buffer;
        this.attname = attname;
        this._length = data.length;
    }

    toBody() {
        return (Buffer.isBuffer(this.buffer) ? this.buffer : this.value);
    }

    isValid() {
        if (this.stub) return true;
        if (typeof this.content_type !== 'string') return false;
        if (Buffer.isBuffer(this.buffer)) return true;
        if (typeof this.value === 'string') return true;
        return false;
    }

    getLength() {
        if (this._length) return this._length;
        if (Buffer.isBuffer(this.buffer)) return this.buffer.length;
        if (this.value) return Buffer.byteLength(this.value);
        return 0;
    }

    toStub() {
        return {
            stub: true,
            content_type: this.content_type,
            length: this.getLength()
        };
    }

    toFollows() {
        return {
            follows: true,
            content_type: this.content_type,
            length: this.getLength()
        };
    }

    toMultipart() {
        return {
            'content-type': this.content_type,
            body: this.toBody() 
        };
    }
}

module.exports = Attachment;
