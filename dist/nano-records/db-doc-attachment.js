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
const err_1 = require("./err");
const stream = require("stream");
class DbDocAttachment {
    constructor(doc) {
        this.doc = doc;
    }
    read(id, name, callback = () => { }) {
        if (!id)
            callback(err_1.default.missingId('attachment'));
        else if (!name)
            callback(err_1.default.missingParam('attachment', "name"));
        else
            this._performRead(id, name, callback);
    }
    _performRead(id, name, callback) {
        this.doc.db.raw.attachment.get(id, name, {}, err_1.default.resultFunc('attachment', callback));
    }
    createReadStream(id, name, callback = () => { }) {
        if (!id) {
            callback(err_1.default.missingId('attachment'));
            return this._emptyStream();
        }
        else if (!name) {
            callback(err_1.default.missingParam('attachment', "name"));
            return this._emptyStream();
        }
        else
            return this._performCreateReadStream(id, name, callback);
    }
    _emptyStream() {
        let readable = new stream.Readable();
        readable._read = () => { };
        readable.push(null);
        return readable;
    }
    _performCreateReadStream(id, name, callback) {
        // TODO: truthfully this returns pretty ugly streams when there is an error
        // would be nice to clean up
        return this.doc.db.raw.attachment.get(id, name, {}, err_1.default.resultFunc('attachment', callback));
    }
    write(id, name, data, mimeType, callback = () => { }) {
        if (!id)
            callback(err_1.default.missingId('attachment'));
        else if (!name)
            callback(err_1.default.missingParam('attachment', "name"));
        else if (!data)
            callback(err_1.default.missingParam('attachment', "data"));
        else if (!mimeType)
            callback(err_1.default.missingParam('attachment', "mimeType"));
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
        this.doc.db.raw.attachment.insert(id, name, data, mimeType, { rev: rev }, err_1.default.resultFunc('attachment', callback));
    }
    destroy(id, name, callback = () => { }) {
        if (!id)
            callback(err_1.default.missingId('attachment'));
        else if (!name)
            callback(err_1.default.missingParam('attachment', "name"));
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
        this.doc.db.raw.attachment.destroy(id, name, { rev: rev }, err_1.default.resultFunc('attachment', callback));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DbDocAttachment;
