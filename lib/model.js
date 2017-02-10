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
const deepExtend = require('deep-extend');

const Db = require('./util/db');
const DocOperations = require('./doc-operations');
const ViewOperations = require('./view-operations');

class Model {
    constructor(body = {}, result = {}) {
        this.body = {};
        deepExtend(this.body, body);
        this.body['_id'] = result['id'] || this.body['_id'];
        this.body['_rev'] = this._latestRev = result['rev'] || this.body['_rev'];
    }

    getDb() {
        return this.constructor.db;
    }

    static use(dbName, nano) {
        if (!dbName)
            throw new Error('Database not provided on model decoration.');
        else if (!nano)
            throw new Error('Nano not provided on model decoration.');
        else
            this.db = new Db(dbName, nano);
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

    attachments() {
        return Object.keys(this.body['_attachments'] || {});
    }

    clone() {
        return new this(this.body, { id: undefined, rev: undefined });
    }
}

module.exports = Model;
