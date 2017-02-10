'use strict';
const DocMeta = require('./util/doc-meta');
const Err = require('./err');

const DocOperations = {};

DocOperations.readDoc = (doc, callback = ()=>{}) => {
    const err = Err.checkOpsDoc(doc);
    if (err)
        callback(err);
    else
        DocMeta.readDoc(doc, callback);
};

DocOperations.read = (Model, id, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id });
    if (err)
        callback(err);
    else
        DocMeta.read(Model, id, callback);
};

DocOperations.headDoc = (doc, callback = ()=>{}) => {
    const err = Err.checkOpsDoc(doc);
    if (err)
        callback(err);
    else
        DocMeta.headDoc(doc, callback);
}

DocOperations.head = (Model, id, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id });
    if (err)
        callback(err);
    else
        DocMeta.head(Model, id, callback);
}

DocOperations.create = (Model, body, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { body });
    if (err)
        callback(err);
    else
        DocMeta.create(Model, undefined, undefined, body, callback);
}

DocOperations.writeDoc = (doc, body, callback = ()=>{}) => {
    const err = Err.checkOpsDoc(doc, { body });
    if (err)
        callback(err);
    else
        DocMeta.writeDoc(doc, body, callback);
}

DocOperations.write = (Model, id, body, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, body });
    if (err)
        callback(err);
    else
        DocMeta.write(Model, id, body, callback);
}

DocOperations.updateDoc = (doc, body, callback = ()=>{}) => {
    const err = Err.checkOpsDoc(doc, { body });
    if (err)
        callback(err);
    else
        DocMeta.updateDoc(doc, body, callback);
}

DocOperations.update = (Model, id, body, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, body });
    if (err)
        callback(err);
    else
        DocMeta.update(Model, id, body, callback);
}

DocOperations.updateOrWrite = (Model, id, body, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, body });
    if (err)
        callback(err);
    else
        DocMeta.updateOrWrite(Model, id, body, callback);
}

DocOperations.destroyDoc = (doc, callback = ()=>{}) => {
    const err = Err.checkOpsDoc(doc);
    if (err)
        callback(err);
    else
        DocMeta.destroyDoc(doc, callback);
};

DocOperations.destroy = (Model, id, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id });
    if (err)
        callback(err);
    else
        DocMeta.destroy(Model, id, callback);
};

module.exports = DocOperations;
