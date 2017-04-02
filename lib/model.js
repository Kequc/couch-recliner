'use strict';

const BodyParser = require('./util/body-parser');
const DocOperations = require('./doc-operations');

class Model {
    constructor(body = {}, result = {}) {
        this.body = body;
        this.body._id = ('id' in result ? result.id : this.body._id);
        this.body._rev = this._latestRev = ('rev' in result ? result.rev : this.body._rev);
    }

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
