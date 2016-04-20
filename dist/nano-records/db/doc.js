var err_1 = require('../err');
var doc_1 = require('../doc');
var attachment_1 = require('./doc/attachment');
var deepExtend = require('deep-extend');
var DbDoc = (function () {
    function DbDoc(db) {
        this.db = db;
        this.attachment = new attachment_1.default(this);
    }
    DbDoc.prototype.create = function (body, callback, tries) {
        var _this = this;
        if (callback === void 0) { callback = function () { }; }
        if (tries === void 0) { tries = 0; }
        tries++;
        this._performCreate(body, function (err, result) {
            if (err) {
                if (tries <= 1 && err.name == "no_db_file") {
                    // create db
                    _this.db.create(function (err) {
                        if (err)
                            callback(err);
                        else
                            _this.create(body, callback, tries);
                    });
                }
                else
                    callback(err);
            }
            else {
                var doc = new doc_1.default(_this.db, body);
                doc.body['_id'] = result['id'];
                doc.body['_rev'] = result['rev'];
                callback(undefined, doc); // created successfully
            }
        });
    };
    DbDoc.prototype._performCreate = function (body, callback) {
        this.db.raw.insert(body, function (err, result) {
            callback(err_1.default.make('doc', err), result);
        });
    };
    DbDoc.prototype.get = function (id, callback, tries) {
        var _this = this;
        if (callback === void 0) { callback = function () { }; }
        if (tries === void 0) { tries = 0; }
        if (!id) {
            callback(err_1.default.missing('doc'));
            return;
        }
        tries++;
        this._performGet(id, function (err, result) {
            if (err)
                if (tries <= 1 && err.name == "no_db_file") {
                    // create db
                    _this.db.create(function (err) {
                        if (err)
                            callback(err);
                        else
                            _this.get(id, callback, tries);
                    });
                }
                else
                    callback(err);
            else
                callback(undefined, new doc_1.default(_this.db, result)); // document found!
        });
    };
    DbDoc.prototype._performGet = function (id, callback) {
        this.db.raw.get(id, function (err, result) {
            callback(err_1.default.make('doc', err), result);
        });
    };
    DbDoc.prototype.overwrite = function (id, body, callback) {
        if (callback === void 0) { callback = function () { }; }
        this.get(id, function (err, doc) {
            if (err)
                callback(err);
            else
                doc.overwrite(body, callback); // attempt overwrite
        });
    };
    DbDoc.prototype.update = function (id, body, callback) {
        if (callback === void 0) { callback = function () { }; }
        this.get(id, function (err, doc) {
            if (err)
                callback(err);
            else
                doc.update(body, callback); // attempt update
        });
    };
    DbDoc.prototype.updateOrCreate = function (id, body, callback) {
        var _this = this;
        if (callback === void 0) { callback = function () { }; }
        this.get(id, function (err, doc) {
            if (err)
                _this.create(deepExtend({}, body, { '_id': id }), callback); // attempt create
            else {
                doc.update(body, function (err) {
                    if (err)
                        callback(err);
                    else
                        callback(undefined, doc);
                }); // attempt update
            }
        });
    };
    DbDoc.prototype.overwriteOrCreate = function (id, body, callback) {
        var _this = this;
        if (callback === void 0) { callback = function () { }; }
        this.get(id, function (err, doc) {
            if (err)
                _this.create(deepExtend({}, body, { '_id': id }), callback); // attempt create
            else {
                doc.overwrite(body, function (err) {
                    if (err)
                        callback(err);
                    else
                        callback(undefined, doc);
                }); // attempt overwrite
            }
        });
    };
    DbDoc.prototype.destroy = function (id, callback) {
        if (callback === void 0) { callback = function () { }; }
        this.get(id, function (err, doc) {
            if (err) {
                if (err.name == "not_found")
                    callback(); // nothing to see here
                else
                    callback(err);
            }
            else
                doc.destroy(callback); // attempt destroy
        });
    };
    return DbDoc;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DbDoc;
