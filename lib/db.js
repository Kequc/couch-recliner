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

const Err = require("./err");
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

    create(callback = ()=>{}) {
        this._performCreate(callback);
    }

    _performCreate(callback) {
        this.nano.db.create(this.dbName, Err.resultFunc('db', callback));
    }

    destroy(verify, callback = ()=>{}) {
        if (verify !== "_DESTROY_")
            callback(Err.verifyFailed('db'));
        else
            this._performDestroy(callback);
    }

    _performDestroy(callback) {
        this.nano.db.destroy(this.dbName, Err.resultFunc('db', callback));
    }

    reset(verify, callback = ()=>{}) {
        if (verify !== "_RESET_")
            callback(Err.verifyFailed('db'));
        else {
            this.destroy("_DESTROY_", (err) => {
                if (!err || err.name == "no_db_file")
                    this.create(callback);
                else
                    callback(err);
            });
        }
    }
}

module.exports = Db;
