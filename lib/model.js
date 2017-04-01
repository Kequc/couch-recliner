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
'use strict';

const BodyParser = require('./util/body-parser');
const Http = require('./util/http');
const DocOperations = require('./doc-operations');
const ViewOperations = require('./view-operations');

class Model {
    constructor(body = {}, result = {}) {
        this.body = BodyParser.forDoc(body);
        this.body._id = ('id' in result ? result.id : this.body._id);
        this.body._rev = this._latestRev = ('rev' in result ? result.rev : this.body._rev);
    }

    static find(keys, params, callback) {
        ViewOperations.find(this, keys, params, callback);
    }

    static findOne(keys, params, callback) {
        ViewOperations.findOne(this, keys, params, callback);
    }

    static findStrict(keys, values, params, callback) {
        ViewOperations.findStrict(this, keys, values, params, callback);
    }

    static findOneStrict(keys, values, params, callback) {
        ViewOperations.findOneStrict(this, keys, values, params, callback);
    }

    static read(id, callback) {
        DocOperations.read(this, id, callback);
    }

    static write(id, body, callback) {
        DocOperations.write(this, id, body, callback);
    }

    static update(id, body, callback) {
        DocOperations.update(this, id, body, callback);
    }

    static updateOrWrite(id, body, callback) {
        DocOperations.updateOrWrite(this, id, body, callback);
    }

    static destroy(id, callback) {
        DocOperations.destroy(this, id, callback);
    }

    static head(id, callback) {
        DocOperations.head(this, id, callback);
    }

    static urlTo(...breadcrumbs) {
        return Http.couchUrl(this.dbUrl, this.dbName, breadcrumbs);
    }

    read(callback) {
        DocOperations.readFixed(this, callback);
    }

    write(body, callback = ()=>{}) {
        DocOperations.writeFixed(this, body, callback);
    }

    update(body, callback = ()=>{}) {
        DocOperations.updateFixed(this, body, callback);
    }

    destroy(callback) {
        DocOperations.destroyFixed(this, callback);
    }

    head(callback) {
        DocOperations.headFixed(this, callback);
    }

    getId() {
        return this.body._id;
    }

    getRev() {
        return this.body._rev;
    }

    attachments() {
        return Object.keys(this.body['_attachments'] || []);
    }
}

Model.MAX_TRIES = 5;

module.exports = Model;
