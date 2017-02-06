/* class DbDoc
 *
 * Acts as an entry point to this library's document interfaces.
 * Expects a id to be specified on almost every operation and generally
 * returns a Doc instance.
 *
 * Most methods mirror those which are available on the Doc
 * class.
 *
 */
"use strict";
const deepExtend = require("deep-extend");

const Err = require("./err");
const Doc = require("./doc");
const DbDocAttachment = require("./db-doc-attachment");

class DbDoc {
    constructor(db) {
        this.db = db;
        this.attachment = new DbDocAttachment(this);
    }

    create(body, callback = ()=>{}) {
        if (!body)
            callback(Err.missingParam('doc', "body"));
        else
            this._performWriteAndInstantiateDoc(undefined, undefined, body, callback);
    }

    read(id, callback = ()=>{}) {
        if (!id)
            callback(Err.missingId('doc'));
        else
            this._read(id, callback);
    }

    _read(id, callback, tries = 0) {
        tries++;
        this._performRead(id, (err, result) => {
            if (err) {
                if (tries <= 1 && err.name == "no_db_file") {
                    // create db
                    this.db.create((err) => {
                        if (err && err.name != "db_already_exists")
                            callback(err);
                        else
                            this._read(id, callback, tries);
                    });
                }
                else
                    callback(err);
            }
            else
                callback(undefined, new Doc(this.db, result)); // document found!
        });
    }

    _performRead(id, callback) {
        this.db.raw.get(id, Err.resultFunc('doc', callback));
    }

    write(id, body, callback = ()=>{}) {
        if (!id)
            callback(Err.missingId('doc'));
        else if (!body)
            callback(Err.missingParam('doc', "body"));
        else
            this._write(id, body, callback);
    }

    _write(id, body, callback, tries = 0) {
        tries++;
        this.head(id, (err, rev) => {
            this._performWriteAndInstantiateDoc(id, rev, body, (err, doc) => {
                if (err) {
                    if (tries <= this.db.maxTries && err.name == "conflict")
                        this._write(id, body, callback, tries);
                    else
                        callback(err);
                }
                else
                    callback(undefined, doc); // successfully written
            });
        });
    }

    update(id, body, callback = ()=>{}) {
        if (!id)
            callback(Err.missingId('doc'));
        else if (!body)
            callback(Err.missingParam('doc', "body"));
        else
            this._update(id, body, callback);
    }

    _update(id, body, callback) {
        this.read(id, (err, doc) => {
            if (err)
                callback(err);
            else {
                // may as well call update on doc
                doc.update(body, (err) => {
                    if (err)
                        callback(err);
                    else
                        callback(undefined, doc); // successfully updated
                });
            }
        });
    }

    updateOrWrite(id, body, callback = ()=>{}) {
        if (!id)
            callback(Err.missingId('doc'));
        else if (!body)
            callback(Err.missingParam('doc', "body"));
        else
            this._updateOrWrite(id, body, callback);
    }

    _updateOrWrite(id, body, callback, tries = 0) {
        tries++;
        this.update(id, body, (err, doc) => {
            if (err) {
                if (err.name == "not_found") {
                    this._performWriteAndInstantiateDoc(id, undefined, body, (err, doc) => {
                        if (err) {
                            if (tries <= this.db.maxTries && err.name == "conflict") {
                                // document exists
                                this._updateOrWrite(id, body, callback, tries);
                            }
                            else
                                callback(err);
                        }
                        else
                            callback(undefined, doc); // successfully written
                    });
                }
                else
                    callback(err);
            }
            else
                callback(undefined, doc); // successfully updated
        });
    }

    _performWriteAndInstantiateDoc(id, rev, body, callback, tries = 0) {
        tries++;
        let clone = deepExtend({}, body);
        this._performWrite(id, rev, clone, (err, result) => {
            if (err) {
                if (tries <= 1 && err.name == "no_db_file") {
                    // create db
                    this.db.create((err) => {
                        if (err && err.name != "db_already_exists")
                            callback(err);
                        else
                            this._performWriteAndInstantiateDoc(id, rev, body, callback, tries);
                    });
                }
                else
                    callback(err);
            }
            else
                callback(undefined, new Doc(this.db, clone, result)); // written successfully
        });
    }

    _performWrite(id, rev, body, callback) {
        body['_rev'] = rev;
        this.db.raw.insert(body, id, Err.resultFunc('doc', callback));
    }

    destroy(id, callback = ()=>{}) {
        if (!id)
            callback(Err.missingId('doc'));
        else
            this._destroy(id, callback);
    }

    _destroy(id, callback, tries = 0) {
        tries++;
        this.head(id, (err, rev) => {
            if (err)
                callback(err);
            else {
                this._performDestroy(id, rev, (err) => {
                    if (err) {
                        if (tries <= this.db.maxTries && err.name == "conflict")
                            this._destroy(id, callback, tries);
                        else
                            callback(err);
                    }
                    else
                        callback(); // successfully destroyed
                });
            }
        });
    }

    _performDestroy(id, rev, callback) {
        this.db.raw.destroy(id, rev, Err.resultFunc('doc', callback));
    }

    head(id, callback = ()=>{}) {
        if (!id)
            callback(Err.missingId('doc'));
        else
            this._head(id, callback);
    }

    _head(id, callback, tries = 0) {
        tries++;
        this._performHead(id, (err, rev, result) => {
            if (err) {
                if (tries <= 1 && err.name == "no_db_file") {
                    // create db
                    this.db.create((err) => {
                        if (err && err.name != "db_already_exists")
                            callback(err);
                        else
                            this._head(id, callback, tries);
                    });
                }
                else
                    callback(err);
            }
            else
                callback(undefined, rev, result); // success
        });
    }

    _performHead(id, callback) {
        // here we need the third parameter
        // not the second
        // the second seems empty...
        this.db.raw.head(id, (raw, body, result) => {
            let err = Err.make('doc', raw);
            if (err)
                callback(err);
            else if (result['etag']) {
                // we have a new rev
                // nano puts it in the format '"etag"' so we need to
                // strip erroneous quotes
                callback(undefined, result['etag'].replace(/"/g, ""), result);
            }
            else
                callback(new Err('doc', "missing_rev", "Rev missing from header response."));
        });
    }
}

module.exports = DbDoc;
