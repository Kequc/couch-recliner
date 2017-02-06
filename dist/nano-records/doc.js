/* class Doc
 *
 * Manages a single instance of a single document in the database.
 * Methods called within this class do not take an `_id` parameter
 * and in general will stop working if the document no longer has
 * one. Ie. If the record was deleted.
 *
 * All methods assume that a database exists.
 *
 */
"use strict";
const err_1 = require("./err");
const doc_attachment_1 = require("./doc-attachment");
const deepExtend = require("deep-extend");
class Doc {
    constructor(db, body = {}, result = {}) {
        this.body = {};
        this.db = db;
        this.attachment = new doc_attachment_1.default(this);
        deepExtend(this.body, body);
        this.body['_id'] = result['id'] || this.body['_id'];
        this.body['_rev'] = this._latestRev = result['rev'] || this.body['_rev'];
    }
    read(callback = () => { }) {
        if (!this.getId())
            callback(err_1.default.missingId('doc'));
        else
            this._read(callback);
    }
    _read(callback) {
        this._performRead((err, result) => {
            if (err)
                callback(err);
            else {
                this.body = result;
                this._latestRev = result['_rev'];
                callback(); // up to date
            }
        });
    }
    _performRead(callback) {
        this.db.raw.get(this.getId(), err_1.default.resultFunc('doc', callback));
    }
    write(body, callback = () => { }) {
        if (!this.getId())
            callback(err_1.default.missingId('doc'));
        else if (!body)
            callback(err_1.default.missingParam('doc', "body"));
        else
            this._write(body, callback);
    }
    _write(body, callback, tries = 0) {
        tries++;
        let clone = deepExtend({}, body);
        this._performWrite(clone, (err, result) => {
            if (err) {
                if (tries <= this.db.maxTries && err.name == "conflict") {
                    this.head((err) => {
                        if (err)
                            callback(err);
                        else
                            this._write(body, callback, tries);
                    });
                }
                else
                    callback(err);
            }
            else {
                this.body = clone;
                this.body['_id'] = result['id'];
                this.body['_rev'] = this._latestRev = result['rev'];
                callback(); // success
            }
        });
    }
    _performWrite(body, callback) {
        body['_rev'] = this._latestRev;
        this.db.raw.insert(body, this.getId(), err_1.default.resultFunc('doc', callback));
    }
    update(body, callback = () => { }) {
        if (!this.getId())
            callback(err_1.default.missingId('doc'));
        else if (!body)
            callback(err_1.default.missingParam('doc', "body"));
        else
            this._update(body, callback);
    }
    _update(body, callback, tries = 0) {
        tries++;
        let clone = deepExtend({}, this.body, body);
        this._performUpdate(clone, (err, result) => {
            if (err) {
                if (tries <= this.db.maxTries && err.name == "conflict") {
                    this.read((err) => {
                        if (err)
                            callback(err);
                        else
                            this._update(body, callback, tries);
                    });
                }
                else
                    callback(err);
            }
            else {
                this.body = clone;
                this.body['_id'] = result['id'];
                this.body['_rev'] = this._latestRev = result['rev'];
                callback(); // success
            }
        });
    }
    _performUpdate(body, callback) {
        if (this.getRev() !== this._latestRev)
            callback(err_1.default.conflict('doc')); // we know we are out of date
        else
            this.db.raw.insert(body, this.getId(), err_1.default.resultFunc('doc', callback));
    }
    destroy(callback = () => { }) {
        if (!this.getId())
            callback(err_1.default.missingId('doc'));
        else
            this._destroy(callback);
    }
    _destroy(callback, tries = 0) {
        tries++;
        this._performDestroy((err) => {
            if (err) {
                if (tries <= this.db.maxTries && err.name == "conflict") {
                    this.head((err) => {
                        if (err)
                            callback(err);
                        else
                            this._destroy(callback, tries);
                    });
                }
                else
                    callback(err);
            }
            else {
                this.body = {};
                callback(); // success
            }
        });
    }
    _performDestroy(callback) {
        this.db.raw.destroy(this.getId(), this._latestRev, err_1.default.resultFunc('doc', callback));
    }
    head(callback = () => { }) {
        if (!this.getId())
            callback(err_1.default.missingId('doc'));
        else
            this._head(callback);
    }
    _head(callback) {
        // we have a method already available for this on the db object
        this.db.doc.head(this.getId(), (err, rev, result) => {
            if (rev)
                this._latestRev = rev;
            callback(err, rev, result);
        });
    }
    getId() {
        return this.body['_id'];
    }
    getRev() {
        return this.body['_rev'];
    }
    getBody() {
        return deepExtend({}, this.body);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Doc;
