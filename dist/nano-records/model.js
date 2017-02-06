"use strict";
const err_1 = require("./err");
const doc_1 = require("./doc");
const deepExtend = require("deep-extend");
class Model {
    constructor(data = {}) {
        this._changes = {};
        if (data instanceof doc_1.default)
            this.doc = data;
        else
            this._changes = data;
    }
    static find(id, callback = () => { }) {
        if (!this.db)
            callback(err_1.default.missingDecorator());
        else {
            this.db.doc.read(id, (err, doc) => {
                if (doc)
                    callback(err, new this(doc));
                else
                    callback(err);
            });
        }
    }
    getAttr(path) {
        const parts = path.split('.');
        let node = this._changes;
        for (const part of parts) {
            node = node[part];
            if (node === undefined)
                return this._getDocAttr(parts);
        }
        return deepExtend({}, node);
    }
    _getDocAttr(parts) {
        if (!this.doc)
            return undefined;
        let node = this.doc.body;
        for (const part of parts) {
            node = node[part];
            if (node === undefined)
                return undefined;
        }
        return deepExtend({}, node);
    }
    setAttr(path, value) {
        const parts = path.split('.');
        const key = parts.pop();
        const added = {};
        let node = added;
        for (const part of parts) {
            node = node[part] = {};
        }
        node[key] = value;
        deepExtend(this._changes, added);
    }
    getId() {
        return (this.doc ? this.doc.getId() : this._changes['_id']);
    }
    getDb() {
        return this.constructor.db;
    }
    save(callback = () => { }) {
        this.update(this._changes, (err) => {
            if (!err)
                this._changes = {};
            callback(err);
        });
    }
    update(body, callback = () => { }) {
        if (!this.getDb())
            callback(err_1.default.missingDecorator());
        else if (this.doc)
            this.doc.update(body, callback);
        else {
            this.getDb().doc.updateOrWrite(this.getId(), body, (err, doc) => {
                if (doc)
                    this.doc = doc;
                callback(err);
            });
        }
    }
    destroy(callback = () => { }) {
        if (!this.getDb())
            callback(err_1.default.missingDecorator());
        else
            this.getDb().doc.destroy(this.getId(), callback);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Model;
