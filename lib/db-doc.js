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
const util = require("util");

const DocOperations = require("./util/doc-operations");
const Doc = require("./doc");
const DbDocAttachment = require("./db-doc-attachment");

class DbDoc {
    constructor(db) {
        this.db = db;
        this.attachment = new DbDocAttachment(this);
        this.Model = Doc;

        this.Model.nano = this.db.nano;
        this.Model.scope = this.db.raw;
        this.Model.dbName = this.db.dbName;
    }

    create(body, callback) {
        DocOperations.create(this.Model, body, callback);
    }

    read(id, callback) {
        DocOperations.readId(this.Model, id, callback);
    }

    write(id, body, callback) {
        DocOperations.writeId(this.Model, id, body, callback);
    }

    update(id, body, callback) {
        DocOperations.updateId(this.Model, id, body, callback);
    }

    updateOrWrite(id, body, callback) {
        DocOperations.updateOrWriteId(this.Model, id, body, callback);
    }

    destroy(id, callback) {
        DocOperations.destroyId(this.Model, id, callback);
    }

    head(id, callback) {
        DocOperations.headId(this.Model, id, callback);
    }
}

module.exports = DbDoc;
