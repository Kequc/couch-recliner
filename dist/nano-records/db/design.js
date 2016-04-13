var DbDesign = (function () {
    function DbDesign(db) {
        this.db = db;
    }
    DbDesign.prototype.show = function (designId, showName, id, callback, tries) {
        if (callback === void 0) { callback = function () { }; }
        if (tries === void 0) { tries = 0; }
        tries++;
        this.db.raw.show(designId, showName, id, function (err, result) {
            if (err) {
                if (tries <= 1 && (['missing', 'deleted', 'missing_named_show'].indexOf(err.message) > -1)) {
                    var design = this.designs[designId];
                    if (!design)
                        callback(new Error("No design specified for: " + designId));
                    else {
                        var shows = {};
                        shows[showName] = design.shows[showName];
                        this.db.doc.updateOrCreate('_design/' + designId, { language: design.language, shows: shows }, function (err) {
                            if (err)
                                callback(err);
                            else
                                this.show(designId, showName, id, callback, tries);
                        }.bind(this));
                    }
                }
                else
                    callback(err);
            }
            else
                callback(null, result); // executed successfully
        }.bind(this));
    };
    DbDesign.prototype.view = function (designId, viewName, params, callback, tries) {
        if (callback === void 0) { callback = function () { }; }
        if (tries === void 0) { tries = 0; }
        tries++;
        this.db.raw.view(designId, viewName, params, function (err, result) {
            if (err) {
                if (tries <= 1 && (['missing', 'deleted', 'missing_named_view'].indexOf(err.message) > -1)) {
                    var design = this.designs[designId];
                    if (!design)
                        callback(new Error("No design specified for: " + designId));
                    else {
                        var views = {};
                        views[viewName] = design.views[viewName];
                        this.db.doc.updateOrCreate('_design/' + designId, { language: design.language, views: views }, function (err) {
                            if (err)
                                callback(err);
                            else
                                this.view(designId, viewName, params, callback, tries);
                        });
                    }
                }
                else
                    callback(err);
            }
            else
                callback(null, result); // executed successfully
        }.bind(this));
    };
    return DbDesign;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DbDesign;
