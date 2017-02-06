/* class DocAttachment
 *
 * Manages attachment operations on a single instance of a single
 * document in the database. Methods called within this class do
 * not take an `_id` parameter and in general will stop working if
 * the document no longer has one.
 *
 * All methods assume that a database exists.
 *
 */
"use strict";
const err_1 = require("./err");
const devNull = require("dev-null");
class DocAttachment {
    constructor(doc) {
        this.doc = doc;
    }
    read(name, callback = () => { }) {
        // we have a method already available for this on the db object
        this.doc.db.doc.attachment.read(this.doc.getId(), name, callback);
    }
    createReadStream(name, callback = () => { }) {
        // we have a method already available for this on the db object
        return this.doc.db.doc.attachment.createReadStream(this.doc.getId(), name, callback);
    }
    write(name, data, mimeType, callback = () => { }) {
        if (!this.doc.getId())
            callback(err_1.default.missingId('doc'));
        else if (!name)
            callback(err_1.default.missingParam('attachment', "name"));
        else if (!data)
            callback(err_1.default.missingParam('attachment', "data"));
        else if (!mimeType)
            callback(err_1.default.missingParam('attachment', "mimeType"));
        else
            this._write(name, data, mimeType, callback);
    }
    _write(name, data, mimeType, callback, tries = 0) {
        tries++;
        this._performWrite(name, data, mimeType, (err, result) => {
            if (err) {
                if (tries <= this.doc.db.maxTries && err.name == "conflict") {
                    this.doc.head((err) => {
                        if (err)
                            callback(err);
                        else
                            this._write(name, data, mimeType, callback, tries);
                    });
                }
                else
                    callback(err);
            }
            else {
                // attachment written
                // TODO: Is there more information available here?
                this.doc.body['_attachments'] = this.doc.body['_attachments'] || {};
                this.doc.body['_attachments'][name] = {};
                // we are intentionally not storing the new rev on the document
                this.doc._latestRev = result['rev'];
                callback();
            }
        });
    }
    _performWrite(name, data, mimeType, callback) {
        this.doc.db.raw.attachment.insert(this.doc.getId(), name, data, mimeType, { rev: this.doc._latestRev }, err_1.default.resultFunc('attachment', callback));
    }
    createWriteStream(name, mimeType, callback = () => { }) {
        if (!this.doc.getId()) {
            callback(err_1.default.missingId('doc'));
            return devNull();
        }
        else if (!name) {
            callback(err_1.default.missingParam('attachment', "name"));
            return devNull();
        }
        else if (!mimeType) {
            callback(err_1.default.missingParam('attachment', "mimeType"));
            return devNull();
        }
        else {
            return this._performCreateWriteStream(name, undefined, mimeType, (err, result) => {
                if (err)
                    callback(err);
                else {
                    // attachment written
                    // TODO: Is there more information available here?
                    this.doc.body['_attachments'] = this.doc.body['_attachments'] || {};
                    this.doc.body['_attachments'][name] = {};
                    // we are intentionally not storing the new rev on the document
                    this.doc._latestRev = result['rev'];
                    callback();
                }
            });
        }
    }
    _performCreateWriteStream(name, data, mimeType, callback) {
        return this.doc.db.raw.attachment.insert(this.doc.getId(), name, data, mimeType, { rev: this.doc._latestRev }, err_1.default.resultFunc('attachment', callback));
    }
    destroy(name, callback = () => { }) {
        if (!this.doc.getId())
            callback(err_1.default.missingId('doc'));
        else if (!name)
            callback(err_1.default.missingParam('attachment', "name"));
        else
            this._destroy(name, callback);
    }
    _destroy(name, callback, tries = 0) {
        tries++;
        this._performDestroy(name, (err, result) => {
            if (err) {
                if (tries <= this.doc.db.maxTries && err.name == "conflict") {
                    this.doc.head((err) => {
                        if (err)
                            callback(err);
                        else
                            this._destroy(name, callback, tries);
                    });
                }
                else
                    callback(err);
            }
            else {
                // attachment removed
                if (this.doc.body['_attachments'])
                    delete this.doc.body['_attachments'][name];
                // we are intentionally not storing the new rev of the document
                this.doc._latestRev = result['rev'];
                callback();
            }
        });
    }
    _performDestroy(name, callback) {
        this.doc.db.raw.attachment.destroy(this.doc.getId(), name, { rev: this.doc._latestRev }, err_1.default.resultFunc('attachment', callback));
    }
    list() {
        let attachments = [];
        for (let name in (this.doc.body['_attachments'] || {})) {
            attachments.push(name);
        }
        ;
        return attachments;
    }
    exists(name) {
        return !!(this.doc.body['_attachments'] && this.doc.body['_attachments'][name]);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DocAttachment;
