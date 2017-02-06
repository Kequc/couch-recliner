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
            callback(Err.missingParam('view', "keys"));
        else if (!values)
            callback(Err.missingParam('view', "values"));
        else if (!params)
            callback(Err.missingParam('view', "params"));
        else
            this._only(keys, values, params, callback);
    }

    all(keys, params, callback) {
        // generated views consisiting of provided keys and full documents
        if (!keys)
            callback(Err.missingParam('view', "keys"));
        else if (!params)
            callback(Err.missingParam('view', "params"));
        else {
            let extended = { include_docs: true };
            this._only(keys, undefined, _.extend({}, params, extended), callback);
        }
    }

    _only(keys, values, params, callback, tries = 0) {
        tries++;
        let name = DbViewBuilder.generateName(keys, values);
        this._performCatalog("_nano_records", name, params, (err, result) => {
            if (err) {
                if (tries <= 1 && (err.name == "no_db_file" || err.name == "not_found")) {
                    let view = {
                        map: DbViewBuilder.mapFunction(keys, values)
                    };
                    this._updateNanoRecordsDesign(name, view, (err) => {
                        if (err)
                            callback(err, new List(this.db));
                        else
                            this._only(keys, values, params, callback, tries);
                    });
                }
                else
                    callback(err, new List(this.db));
            }
            else
                callback(undefined, new List(this.db, result)); // executed successfully
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
    catalog(design, name, params, callback = ()=>{}) {
        if (!design)
            callback(Err.missingParam('view', "design"));
        else if (!name)
            callback(Err.missingParam('view', "name"));
        else if (!params)
            callback(Err.missingParam('view', "params"));
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
                            callback(err, new List(this.db));
                        else
                            this._catalog(design, name, params, callback, tries);
                    });
                }
                else
                    callback(err, new List(this.db));
            }
            else
                callback(undefined, new List(this.db, result)); // executed successfully
        });
    }

    _performCatalog(design, name, params, callback) {
        this.db.raw.view(design, name, params, Err.resultFunc('view', callback));
    }

    _updateDesign(designId, names, callback) {
        let design = this.db.designs[designId];
        if (!design) {
            callback(new Err('view', "not_defined", "No design specified for: " + designId));
            return;
        }
        // generate design document
        let body = { language: design.language, views: {} };
        for (let name of names) {
            if (design.views[name])
                body.views[name] = design.views[name];
            else {
                callback(new Err('view', "missing_view", "Missing deinition for: " + name));
                return;
            }
        }
        // update design
        this.db.doc.updateOrWrite('_design/' + designId, body, callback);
    }
}

module.exports = DbView;
