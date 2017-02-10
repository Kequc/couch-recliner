'use strict';
const ShowMeta = require('./meta/show-meta');
const Err = require('./err');

// TODO: we need a way to force persist individual shows in
// cases where they have been changed

const ShowOperations = {};

ShowOperations.catalogDoc = (doc, design, name, callback = ()=>{}) => {
    const err = Err.checkOpsDoc(doc, { design, name });
    if (err)
        callback(err);
    else
        ShowMeta.catalogDoc(doc, design, name, callback);
}

ShowOperations.catalog = (Model, id, design, name, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, design, name });
    if (err)
        callback(err);
    else
        ShowMeta.catalog(Model, id, design, name, callback);
}

module.exports = ShowOperations;
