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
const deepExtend = require("deep-extend");

const DocOperations = require("./util/doc-operations");

class Model {
    constructor(body = {}, result = {}) {
        this.body = {};
        deepExtend(this.body, body);
        this.body['_id'] = result['id'] || this.body['_id'];
        this.body['_rev'] = this._latestRev = result['rev'] || this.body['_rev'];
    }

    static decorate (nano, dbName) {
        this.nano = nano;
        this.scope = this.nano.use(dbName);
    }

    static read(id, callback) {
        DocOperations.read(this.Model, id, callback);
    }

    static write(id, body, callback) {
        DocOperations.write(this.Model, id, body, callback);
    }

    static update(id, body, callback) {
        DocOperations.update(this.Model, id, body, callback);
    }

    static updateOrWrite(id, body, callback) {
        DocOperations.updateOrWrite(this.Model, id, body, callback);
    }

    static destroy(id, callback) {
        DocOperations.destroy(this.Model, id, callback);
    }

    static head(id, callback) {
        DocOperations.head(this.Model, id, callback);
    }

    read(callback) {
        DocOperations.readDoc(this, callback);
    }

    write(body, callback = ()=>{}) {
        DocOperations.writeDoc(this, body, callback);
    }

    update(body, callback = ()=>{}) {
        DocOperations.updateDoc(this, body, callback);
    }

    destroy(callback) {
        DocOperations.destroyDoc(this, callback);
    }

    head(callback) {
        DocOperations.headDoc(this, callback);
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

module.exports = Model;
