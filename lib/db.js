/* class Db
 *
 * Maintains a set of core settings for the database instance.
 * Also offers some basic database functions such as create and
 * destroy.
 *
 * Delivers an entry point into all other classes.
 *
 */
"use strict";
const deepExtend = require("deep-extend");

const DbOperations = require("./util/db-operations");
const DbDoc = require("./db-doc");
const DbView = require("./db-view");
const DbShow = require("./db-show");

class Db {
    constructor(nano, dbName, designs) {
        this.maxTries = 5;
        this.designs = {};
        this.nano = nano;
        this.dbName = dbName;
        this.raw = this.nano.use(this.dbName);
        for (let key in designs) {
            this.designs[key] = {
                language: "javascript",
                shows: {},
                views: {}
            };
        }
        deepExtend(this.designs, designs);
        this.doc = new DbDoc(this);
        this.view = new DbView(this);
        this.show = new DbShow(this);
    }

    create(callback) {
        DbOperations.create(this.doc.model, callback);
    }

    destroy(verify, callback) {
        DbOperations.destroy(this.doc.model, verify, callback);
    }

    reset(verify, callback) {
        DbOperations.reset(this.doc.model, verify, callback);
    }
}

module.exports = Db;
