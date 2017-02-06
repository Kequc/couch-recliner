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
const err_1 = require("./err");
const db_doc_1 = require("./db-doc");
const db_view_1 = require("./db-view");
const db_show_1 = require("./db-show");
const model_1 = require("./model");
const deepExtend = require("deep-extend");
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
        this.doc = new db_doc_1.default(this);
        this.view = new db_view_1.default(this);
        this.show = new db_show_1.default(this);
    }
    create(callback = () => { }) {
        this._performCreate(callback);
    }
    _performCreate(callback) {
        this.nano.db.create(this.dbName, err_1.default.resultFunc('db', callback));
    }
    destroy(verify, callback = () => { }) {
        if (verify !== "_DESTROY_")
            callback(err_1.default.verifyFailed('db'));
        else
            this._performDestroy(callback);
    }
    _performDestroy(callback) {
        this.nano.db.destroy(this.dbName, err_1.default.resultFunc('db', callback));
    }
    reset(verify, callback = () => { }) {
        if (verify !== "_RESET_")
            callback(err_1.default.verifyFailed('db'));
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
Db.Model = model_1.default;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Db;
