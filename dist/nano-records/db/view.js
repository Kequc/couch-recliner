/* class DbDesign
 *
 * Responsible for manipulation and execution of CouchDB design
 * document views. Will generally persist and update design documents
 * in the database and returns List objects resulting from design
 * queries.
 *
 */
"use strict";
var err_1 = require('../err');
var list_1 = require('../list');
var view_1 = require('../util/view');
var _ = require('underscore');
var DbView = (function () {
    function DbView(db) {
        this.db = db;
    }
    DbView.prototype.only = function (keys, values, params, callback) {
        // generated views consisiting of provided keys and values
        if (!keys)
            callback(err_1.default.missingParam('view', "keys"));
        else if (!values)
            callback(err_1.default.missingParam('view', "values"));
        else if (!params)
            callback(err_1.default.missingParam('view', "params"));
        else
            this._only(keys, values, params, callback);
    };
    DbView.prototype.all = function (keys, params, callback) {
        // generated views consisiting of provided keys and full documents
        if (!keys)
            callback(err_1.default.missingParam('view', "keys"));
        else if (!params)
            callback(err_1.default.missingParam('view', "params"));
        else {
            var extended = { include_docs: true };
            this._only(keys, undefined, _.extend({}, params, extended), callback);
        }
    };
    DbView.prototype._only = function (keys, values, params, callback, tries) {
        var _this = this;
        if (tries === void 0) { tries = 0; }
        tries++;
        var name = view_1.ViewUtil.generateName(keys, values);
        this._performRead("_nano_records", name, params, function (err, result) {
            if (err) {
                if (tries <= 1 && (err.name == "no_db_file" || err.name == "not_found")) {
                    var view = {
                        map: view_1.ViewUtil.mapFunction(keys, values)
                    };
                    _this._updateNanoRecordsDesign(name, view, function (err) {
                        if (err)
                            callback(err);
                        else
                            _this._only(keys, values, params, callback, tries);
                    });
                }
                else
                    callback(err);
            }
            else
                callback(undefined, new list_1.default(_this.db, result)); // executed successfully
        });
    };
    DbView.prototype._updateNanoRecordsDesign = function (name, view, callback) {
        // generate design view
        var body = { language: "javascript", views: {} };
        body.views[name] = view;
        this.db.doc.forcedUpdate('_design/_nano_records', body, callback);
    };
    // TODO: we need a way to force persist individual views in
    // cases where they have been changed
    DbView.prototype.read = function (id, name, params, callback) {
        if (callback === void 0) { callback = function () { }; }
        if (!id)
            callback(err_1.default.missingId('view'));
        else if (!name)
            callback(err_1.default.missingParam('view', "name"));
        else if (!params)
            callback(err_1.default.missingParam('view', "params"));
        else
            this._read(id, name, params, callback);
    };
    DbView.prototype._read = function (id, name, params, callback, tries) {
        var _this = this;
        if (tries === void 0) { tries = 0; }
        tries++;
        this._performRead(id, name, params, function (err, result) {
            if (err) {
                if (tries <= 1 && (err.name == "no_db_file" || err.name == "not_found")) {
                    _this._updateDesign(id, [name], function (err) {
                        if (err)
                            callback(err);
                        else
                            _this._read(id, name, params, callback, tries);
                    });
                }
                else
                    callback(err);
            }
            else
                callback(undefined, new list_1.default(_this.db, result)); // executed successfully
        });
    };
    DbView.prototype._performRead = function (id, name, params, callback) {
        this.db.raw.view(id, name, params, err_1.default.resultFunc('view', callback));
    };
    DbView.prototype._updateDesign = function (id, names, callback) {
        var design = this.db.designs[id];
        if (!design) {
            callback(new err_1.default('view', "not_defined", "No design specified for: " + id));
            return;
        }
        // generate design document
        var body = { language: design.language, views: {} };
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            if (design.views[name_1])
                body.views[name_1] = design.views[name_1];
            else {
                callback(new err_1.default('view', "missing_view", "Missing deinition for: " + name_1));
                return;
            }
        }
        // update design
        this.db.doc.forcedUpdate('_design/' + id, body, callback);
    };
    return DbView;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DbView;
