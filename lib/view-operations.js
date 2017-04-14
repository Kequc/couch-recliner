'use strict';
const ViewMeta = require('./meta/view-meta');
const Err = require('./models/err');

// TODO: we need a way to force persist individual views in
// cases where they have been changed

const ViewOperations = {};

ViewOperations.find = (Model, keys, params, callback = ()=>{}) => {
    // generated views consisiting of provided keys and full documents
    const err = Err.checkOps(Model, { keys, params });
    if (err)
        callback(err);
    else
        ViewMeta.find(Model, keys, params, callback);
};

ViewOperations.findOne = (Model, keys, params, callback = ()=>{}) => {
    // find only the first result from the provided parameters
    const err = Err.checkOps(Model, { keys, params });
    if (err)
        callback(err);
    else
        ViewMeta.findOne(Model, keys, params, callback);
};

ViewOperations.findStrict = (Model, keys, values, params, callback = ()=>{}) => {
    // generated views consisiting of provided keys and values
    const err = Err.checkOps(Model, { keys, values, params });
    if (err)
        callback(err);
    else
        ViewMeta.findStrict(Model, keys, values, params, callback);
};

ViewOperations.findOneStrict = (Model, keys, values, params, callback = ()=>{}) => {
    // find only the first result from the provided parameters
    const err = Err.checkOps(Model, { keys, values, params });
    if (err)
        callback(err);
    else
        ViewMeta.findOneStrict(Model, keys, values, params, callback);
};

ViewOperations.catalog = (Model, design, name, params, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { design, name, params });
    if (err)
        callback(err);
    else
        ViewMeta.catalog(Model, design, name, params, callback);
};

module.exports = ViewOperations;
