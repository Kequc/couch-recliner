/* class DbView
 *
 * Responsible for manipulation and execution of CouchDB design
 * document views. Will generally persist and update design documents
 * in the database and returns List objects resulting from design
 * queries.
 *
 */
"use strict";
const _ = require("underscore");

const Err = require("./err");
const List = require("./list");
const DbViewBuilder = require("./db-view-builder");

class DbView {
    constructor(db) {
        this.db = db;
    }
    only(keys, values, params, callback) {
        // generated views consisiting of provided keys and values
        if (!keys)
            callback(Err.default.missingParam('view', "keys"));
        else if (!values)
            callback(Err.default.missingParam('view', "values"));
        else if (!params)
            callback(Err.default.missingParam('view', "params"));
        else
            this._only(keys, values, params, callback);
    }
    all(keys, params, callback) {
        // generated views consisiting of provided keys and full documents
        if (!keys)
            callback(Err.default.missingParam('view', "keys"));
        else if (!params)
            callback(Err.default.missingParam('view', "params"));
        else {
            let extended = { include_docs: true };
            this._only(keys, undefined, _.extend({}, params, extended), callback);
        }
    }
    _only(keys, values, params, callback, tries = 0) {
        tries++;
        let name = DbViewBuilder.DbViewBuilder.generateName(keys, values);
        this._performCatalog("_nano_records", name, params, (err, result) => {
            if (err) {
                if (tries <= 1 && (err.name == "no_db_file" || err.name == "not_found")) {
                    let view = {
                        map: DbViewBuilder.DbViewBuilder.mapFunction(keys, values)
                    };
                    this._updateNanoRecordsDesign(name, view, (err) => {
                        if (err)
                            callback(err, new List.default(this.db));
                        else
                            this._only(keys, values, params, callback, tries);
                    });
                }
                else
                    callback(err, new List.default(this.db));
            }
            else
                callback(undefined, new List.default(this.db, result)); // executed successfully
        });
    }
    _updateNanoRecordsDesign(name, view, callback) {
        // generate design view
        let body = { language: "javascript", views: {} };
        body.views[name] = view;
        this.db.doc.updateOrWrite('_design/_nano_records', body, callback);
    }
    // TODO: we need a way to force persist individual views in
    // cases where they have been changed
    catalog(design, name, params, callback = () => { }) {
        if (!design)
            callback(Err.default.missingParam('view', "design"));
        else if (!name)
            callback(Err.default.missingParam('view', "name"));
        else if (!params)
            callback(Err.default.missingParam('view', "params"));
        else
            this._catalog(design, name, params, callback);
    }
    _catalog(design, name, params, callback, tries = 0) {
        tries++;
        this._performCatalog(design, name, params, (err, result) => {
            if (err) {
                if (tries <= 1 && (err.name == "no_db_file" || err.name == "not_found")) {
                    this._updateDesign(design, [name], (err) => {
                        if (err)
                            callback(err, new List.default(this.db));
                        else
                            this._catalog(design, name, params, callback, tries);
                    });
                }
                else
                    callback(err, new List.default(this.db));
            }
            else
                callback(undefined, new List.default(this.db, result)); // executed successfully
        });
    }
    _performCatalog(design, name, params, callback) {
        this.db.raw.view(design, name, params, Err.default.resultFunc('view', callback));
    }
    _updateDesign(designId, names, callback) {
        let design = this.db.designs[designId];
        if (!design) {
            callback(new Err.default('view', "not_defined", "No design specified for: " + designId));
            return;
        }
        // generate design document
        let body = { language: design.language, views: {} };
        for (let name of names) {
            if (design.views[name])
                body.views[name] = design.views[name];
            else {
                callback(new Err.default('view', "missing_view", "Missing deinition for: " + name));
                return;
            }
        }
        // update design
        this.db.doc.updateOrWrite('_design/' + designId, body, callback);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DbView;
