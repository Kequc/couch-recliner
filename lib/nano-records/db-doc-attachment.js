/* class DbDocAttachment
 *
 * Acts as an entry point to this library's document attachment
 * interfaces. Expects a id to be specified on every operation
 * and generally doesn't return anything. It may be nice in the
 * future to return newly created Doc instances.
 *
 * Most methods mirror those which are available on the
 * DocAttachment class.
 *
 */
"use strict";
const stream = require("stream");

const Err = require("./err");
const DocAttachment = require("./doc-attachment");

function _emptyStream() {
    const readable = new stream.Readable();
    readable._read = ()=>{};
    readable.push(null);
    return readable;
}

class DbDocAttachment {
    constructor(doc) {
        this.doc = doc;
        this.Model = DocAttachment;
    }

    inherit (Model) {
        util.inherit(Child, Doc);
        this.Model = Child;
    }

    read(id, name, callback = ()=>{}) {
        if (!id)
            callback(Err.missingId('attachment'));
        else if (!name)
            callback(Err.missingParam('attachment', "name"));
        else
            this._performRead(id, name, callback);
    }

    _performRead(id, name, callback) {
        this.doc.db.raw.attachment.get(id, name, {}, Err.resultFunc('attachment', callback));
    }

    createReadStream(id, name, callback = ()=>{}) {
        if (!id) {
            callback(Err.missingId('attachment'));
            return _emptyStream();
        }
        else if (!name) {
            callback(Err.missingParam('attachment', "name"));
            return _emptyStream();
        }
        else
            return this._performCreateReadStream(id, name, callback);
    }

    _performCreateReadStream(id, name, callback) {
        // TODO: truthfully this returns pretty ugly streams when there is an error
        // would be nice to clean up
        return this.doc.db.raw.attachment.get(id, name, {}, Err.resultFunc('attachment', callback));
    }

    write(id, name, data, mimeType, callback = ()=>{}) {
        if (!id)
            callback(Err.missingId('attachment'));
        else if (!name)
            callback(Err.missingParam('attachment', "name"));
        else if (!data)
            callback(Err.missingParam('attachment', "data"));
        else if (!mimeType)
            callback(Err.missingParam('attachment', "mimeType"));
        else
            this._write(id, name, data, mimeType, callback);
    }

    _write(id, name, data, mimeType, callback, tries = 0) {
        tries++;
        this.doc.head(id, (err, rev) => {
            if (err)
                callback(err);
            else {
                this._performWrite(id, rev, name, data, mimeType, (err) => {
                    if (err) {
                        if (tries <= this.doc.db.maxTries && err.name == "conflict")
                            this._write(id, name, data, mimeType, callback, tries);
                        else
                            callback(err);
                    }
                    else
                        callback(); // successfully written
                });
            }
        });
    }

    _performWrite(id, rev, name, data, mimeType, callback) {
        this.doc.db.raw.attachment.insert(id, name, data, mimeType, { rev: rev }, Err.resultFunc('attachment', callback));
    }

    destroy(id, name, callback = ()=>{}) {
        if (!id)
            callback(Err.missingId('attachment'));
        else if (!name)
            callback(Err.missingParam('attachment', "name"));
        else
            this._destroy(id, name, callback);
    }

    _destroy(id, name, callback, tries = 0) {
        tries++;
        this.doc.head(id, (err, rev) => {
            if (err)
                callback(err);
            else {
                this._performDestroy(id, rev, name, (err) => {
                    if (err) {
                        if (tries <= this.doc.db.maxTries && err.name == "conflict")
                            this._destroy(id, name, callback, tries);
                        else
                            callback(err);
                    }
                    else
                        callback(); // successfully destroyed
                });
            }
        });
    }

    _performDestroy(id, rev, name, callback) {
        this.doc.db.raw.attachment.destroy(id, name, { rev: rev }, Err.resultFunc('attachment', callback));
    }
}

module.exports = DbDocAttachment;
