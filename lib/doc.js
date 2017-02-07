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
const DocAttachment = require("./doc-attachment");

class Doc {
    constructor(body = {}, result = {}) {
        this.body = {};
        this.attachment = new DocAttachment(this);
        deepExtend(this.body, body);
        this.body['_id'] = result['id'] || this.body['_id'];
        this.body['_rev'] = this._latestRev = result['rev'] || this.body['_rev'];
    }

    read(callback) {
        DocOperations.read(this, callback);
    }

    write(body, callback = ()=>{}) {
        DocOperations.write(this, body, callback);
    }

    update(body, callback = ()=>{}) {
        DocOperations.update(this, body, callback);
    }

    destroy(callback) {
        DocOperations.destroy(this, callback);
    }

    head(callback) {
        DocOperations.head(this, callback);
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

module.exports = Doc;
