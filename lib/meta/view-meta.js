'use strict';
const _ = require('underscore');

const DocMeta = require('./doc-meta');
const List = require('../util/list');
const ViewBuilder = require('../util/view-builder');

const ViewMeta = {};

ViewMeta.findOne = (Model, keys, params, callback = ()=>{}) => {
    ViewMeta.find(Model, keys, params, (err, list) => {
        const doc = list.doc(0);
        if (!err && !doc)
            callback(Err.missing('doc'));
        else
            callback(err, doc);
    });
}

ViewMeta.findDoc = (doc, keys, params, callback) => {
    ViewMeta.find(doc.constructor, doc.getId(), keys, params, callback);
}

ViewMeta.find = (Model, keys, params, callback) => {
    const paramsClone = _.extend({}, params, { include_docs: true });
    ViewMeta.findStrict(Model, keys, undefined, paramsClone, callback);
}

ViewMeta.findOneStrict = (Model, keys, values, params, callback = ()=>{}) => {
    ViewMeta.findStrict(Model, keys, values, params, (err, list) => {
        const doc = list.doc(0);
        if (!err && !doc)
            callback(Err.missing('doc'));
        else
            callback(err, doc);
    });
}

ViewMeta.findStrict = (Model, keys, values, params, callback, tries = 0) => {
    tries++;
    const name = ViewBuilder.generateName(keys, values);
    Model.db.view('_nano_records', name, params, (err, result) => {
        if (err && tries <= 1 && (err.name === 'no_db_file' || err.name === 'not_found')) {
            const view = {
                map: ViewBuilder.mapFunction(keys, values)
            };
            _updateNanoRecordsDesign(Model, name, view, (err) => {
                if (err)
                    callback(err, new List(this.db));
                else
                    ViewMeta.findStrict(Model, keys, values, params, callback, tries);
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
    DocMeta.updateOrWrite(Model, '_design/_nano_records', body, callback);
}

ViewMeta.catalog = (Model, design, name, params, callback, tries = 0) => {
    tries++;
    Model.db.view(Model, design, name, params, (err, result) => {
        if (err && tries <= 1 && (err.name === 'no_db_file' || err.name === 'not_found')) {
            _updateDesign(Model, design, [name], (err) => {
                if (err)
                    callback(err, new List(this.db));
                else
                    ViewMeta.catalog(Model, design, name, params, callback, tries);
            });
        }
        else if (err)
            callback(err, new List(Model));
        else
            callback(undefined, new List(Model, result)); // executed successfully
    });
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
    DocMeta.updateOrWrite(Model, '_design/' + designId, body, callback);
}

module.exports = ViewMeta;
