'use strict';
const DocMeta = require('./meta/doc-meta');

const Err = require('./models/err');
const Finder = require('./models/finder');

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
    if (err)
        callback(err);
    else
        DocMeta.create(Model, undefined, undefined, body, callback);
};

DocOperations.writeFixed = (doc, body, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc, { body });
    if (err)
        callback(err);
    else
        DocMeta.writeFixed(doc, body, callback);
};

DocOperations.write = (Model, id, body, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, body });
    if (err)
        callback(err);
    else
        DocMeta.write(Model, id, body, callback);
};

DocOperations.updateFixed = (doc, body, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc, { body });
    if (err)
        callback(err);
    else
        DocMeta.updateFixed(doc, body, callback);
};

DocOperations.update = (Model, id, body, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, body });
    if (err)
        callback(err);
    else
        DocMeta.update(Model, id, body, callback);
};

DocOperations.updateOrWrite = (Model, id, body, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, body });
    if (err)
        callback(err);
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

DocOperations.findOne = (Model, finder, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { finder });
    if (!(finder instanceof Finder)) finder = new Finder(finder);
    if (err)
        callback(err);
    else if (!finder.isValid())
        callback(Err.invalidParam('finder'));
    else
        DocMeta.findOne(Model, finder, callback);
};

DocOperations.find = (Model, finder, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { finder });
    if (!(finder instanceof Finder)) finder = new Finder(finder);
    if (err)
        callback(err);
    else if (!finder.isValid())
        callback(Err.invalidParam('finder'));
    else
        DocMeta.find(Model, finder, callback);
};

module.exports = DocOperations;
