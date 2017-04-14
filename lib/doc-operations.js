'use strict';
const DocMeta = require('./meta/doc-meta');

const Body = require('./models/body');
const Err = require('./models/err');

const DocOperations = {};

DocOperations.readFixed = (doc, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc);
    if (err)
        callback(err);
    else
        DocMeta.readFixed(doc, callback);
};

DocOperations.read = (Model, id, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id });
    if (err)
        callback(err);
    else
        DocMeta.read(Model, id, callback);
};

DocOperations.headFixed = (doc, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc);
    if (err)
        callback(err);
    else
        DocMeta.headFixed(doc, callback);
};

DocOperations.head = (Model, id, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id });
    if (err)
        callback(err);
    else
        DocMeta.head(Model, id, callback);
};

DocOperations.create = (Model, body, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { body });
    if (!(body instanceof Body)) body = Body.create(body);
    if (err)
        callback(err);
    else if (!body.isValid())
        callback(Err.invalidParam('body'));
    else
        DocMeta.create(Model, undefined, undefined, body, callback);
};

DocOperations.writeFixed = (doc, body, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc, { body });
    if (!(body instanceof Body)) body = Body.create(body);
    if (err)
        callback(err);
    else if (!body.isValid())
        callback(Err.invalidParam('body'));
    else
        DocMeta.writeFixed(doc, body, callback);
};

DocOperations.write = (Model, id, body, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, body });
    if (!(body instanceof Body)) body = Body.create(body);
    if (err)
        callback(err);
    else if (!body.isValid())
        callback(Err.invalidParam('body'));
    else
        DocMeta.write(Model, id, body, callback);
};

DocOperations.updateFixed = (doc, body, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc, { body });
    if (!(body instanceof Body)) body = Body.create(body);
    if (err)
        callback(err);
    else if (!body.isValid())
        callback(Err.invalidParam('body'));
    else
        DocMeta.updateFixed(doc, body, callback);
};

DocOperations.update = (Model, id, body, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, body });
    if (!(body instanceof Body)) body = Body.create(body);
    if (err)
        callback(err);
    else if (!body.isValid())
        callback(Err.invalidParam('body'));
    else
        DocMeta.update(Model, id, body, callback);
};

DocOperations.updateOrWrite = (Model, id, body, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, body });
    if (!(body instanceof Body)) body = Body.create(body);
    if (err)
        callback(err);
    else if (!body.isValid())
        callback(Err.invalidParam('body'));
    else
        DocMeta.updateOrWrite(Model, id, body, callback);
};

DocOperations.destroyFixed = (doc, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc);
    if (err)
        callback(err);
    else
        DocMeta.destroyFixed(doc, callback);
};

DocOperations.destroy = (Model, id, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id });
    if (err)
        callback(err);
    else
        DocMeta.destroy(Model, id, callback);
};

module.exports = DocOperations;
