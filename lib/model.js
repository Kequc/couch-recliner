'use strict';
const AttachmentOperations = require('./attachment-operations');
const Couch = require('./models/couch');
const DocOperations = require('./doc-operations');
const FindOperations = require('./find-operations');

class Model {
    static create(body, callback) {
        DocOperations.create(this, body, callback);
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

    static findOne(finder, callback) {
        FindOperations.findOne(this, finder, callback);
    }

    static find(finder, callback) {
        FindOperations.find(this, finder, callback);
    }

    static attachment(id, attname, callback) {
        AttachmentOperations.read(this, id, attname, callback);
    }

    static get couch() { return this._couch; }
    static set couch(value) {
        if (!(value instanceof Couch)) value = new Couch(value);
        this._couch = value;
    }

    static get MAX_TRIES() { return this._MAX_TRIES; }
    static set MAX_TRIES(value) {
        if (typeof value === 'number')
            this._MAX_TRIES = value;
        else
            throw new Error('Invalid parameter MAX_TRIES. ' + value);
    }

    get body() { return this._body; }
    get id() { return this._id; }
    get rev() { return this._rev; }

    read(callback) {
        DocOperations.readFixed(this, callback);
    }

    write(body, callback) {
        DocOperations.writeFixed(this, body, callback);
    }

    update(body, callback) {
        DocOperations.updateFixed(this, body, callback);
    }

    destroy(callback) {
        DocOperations.destroyFixed(this, callback);
    }

    head(callback) {
        DocOperations.headFixed(this, callback);
    }

    attachment(attname, callback) {
        AttachmentOperations.readFixed(this, attname, callback);
    }
}

Model.couch = new Couch();
Model.MAX_TRIES = 5;

module.exports = Model;
