'use strict';
const _ = require('underscore');

const List = require('./util/list');
const ViewBuilder = require('./util/view-builder');
const DocOperations = require('./doc-operations');
const Err = require('./err');

const ViewOperations = {};

ViewOperations.find = (Model, keys, params, callback = ()=>{}) => {
    // generated views consisiting of provided keys and full documents
    if (!Model)
        callback(Err.missingParam('model'));
    else if (!Model.db)
        callback(Err.missingNano());
    else if (!keys)
        callback(Err.missingParam('keys'));
    else if (!params)
        callback(Err.missingParam('params'));
    else
        _findStrict(Model, keys, undefined, _.extend({}, params, { include_docs: true }), callback);
}

ViewOperations.findOne = (Model, keys, params, callback = ()=>{}) => {
    // find only the first result from the provided parameters
    ViewOperations.find(Model, keys, params, (err, list) => {
        const doc = list.doc(0);
        if (!err && !doc)
            callback(Err.missing('doc'));
        else
            callback(err, doc);
    });
}

ViewOperations.findStrict = (Model, keys, values, params, callback = ()=>{}) => {
    // generated views consisiting of provided keys and values
    if (!Model)
        callback(Err.missingParam('model'));
    else if (!Model.db)
        callback(Err.missingNano());
    else if (!keys)
        callback(Err.missingParam('keys'));
    else if (!values)
        callback(Err.missingParam('values'));
    else if (!params)
        callback(Err.missingParam('params'));
    else
        _findStrict(Model, keys, values, params, callback);
}

ViewOperation.findOneStrict = (Model, keys, values, params, callback = ()=>{}) => {
    // find only the first result from the provided parameters
    ViewOperations.findStrict(Model, keys, values, params, (err, list) => {
        const doc = list.doc(0);
        if (!err && !doc)
            callback(Err.missing('doc'));
        else
            callback(err, doc);
    });
}

function _findStrict(Model, keys, values, params, callback, tries = 0) {
    tries++;
    const name = ViewBuilder.generateName(keys, values);
    _performCatalog(Model, '_nano_records', name, params, (err, result) => {
        if (err && tries <= 1 && (err.name === 'no_db_file' || err.name === 'not_found')) {
            const view = {
                map: ViewBuilder.mapFunction(keys, values)
            };
            _updateNanoRecordsDesign(Model, name, view, (err) => {
                if (err)
                    callback(err, new List(this.db));
                else
                    _findStrict(Model, keys, values, params, callback, tries);
            });
        }
        else if (err)
            callback(err, new List(Model));
        else
            callback(undefined, new List(Model, result)); // executed successfully
    });
}

function _updateNanoRecordsDesign(Model, name, view, callback) {
    // generate design view
    const body = {
        language: 'javascript',
        views: {}
    };
    body.views[name] = view;
    DocOperations.updateOrWrite(Model, '_design/_nano_records', body, callback);
}

// TODO: we need a way to force persist individual views in
// cases where they have been changed
ViewOperations.catalog = (Model, design, name, params, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('model'));
    else if (!Model.db)
        callback(Err.missingNano());
    else if (!design)
        callback(Err.missingParam('design'));
    else if (!name)
        callback(Err.missingParam('name'));
    else if (!params)
        callback(Err.missingParam('params'));
    else
        _catalog(Model, design, name, params, callback);
}

function _catalog(Model, design, name, params, callback, tries = 0) {
    tries++;
    _performCatalog(Model, design, name, params, (err, result) => {
        if (err && tries <= 1 && (err.name === 'no_db_file' || err.name === 'not_found')) {
            _updateDesign(Model, design, [name], (err) => {
                if (err)
                    callback(err, new List(this.db));
                else
                    _catalog(Model, design, name, params, callback, tries);
            });
        }
        else if (err)
            callback(err, new List(Model));
        else
            callback(undefined, new List(Model, result)); // executed successfully
    });
}

function _performCatalog(Model, design, name, params, callback) {
    this.db.raw.view(Model, design, name, params, Err.resultFunc('view', callback));
}

function _updateDesign(Model, designId, names, callback) {
    const design = this.db.designs[designId];
    if (!design) {
        callback(new Err('view', 'not_defined', 'No design specified for: ' + designId));
        return;
    }
    // generate design document
    const body = {
        language: design.language,
        views: {}
    };
    for (const name of names) {
        if (design.views[name])
            body.views[name] = design.views[name];
        else {
            callback(new Err('view', 'missing_view', 'Missing deinition for: ' + name));
            return;
        }
    }
    // update design
    DocOperations.updateOrWrite(Model, '_design/' + designId, body, callback);
}

module.exports = ViewOperations;
