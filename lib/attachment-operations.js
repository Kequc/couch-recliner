'use strict';
const devNull = require('dev-null');

const Err = require('./util/err');
const AttachmentMeta = require('./meta/attachment-meta');

const AttachmentOperations = {};

AttachmentOperations.readFixed = (doc, name, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc, { name });
    if (err) {
        callback(err); return devNull;
    } else
        AttachmentMeta.readFixed(doc, name, callback);
};

AttachmentOperations.read = (Model, id, name, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, name });
    if (err) {
        callback(err); return devNull;
    } else
        AttachmentMeta.read(Model, id, name, callback);
};

AttachmentOperations.writeFixed = (doc, name, file, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc, { name, file });
    if (err) {
        callback(err); return devNull;
    } else
        AttachmentMeta.writeFixed(doc, name, file, callback);
};

AttachmentOperations.write = (Model, id, name, file, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, name, file });
    if (err)
        callback(err);
    else
        AttachmentMeta.write(Model, id, name, file, callback);
};

AttachmentOperations.destroyFixed = (doc, name, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc, { name });
    if (err)
        callback(err);
    else
        AttachmentMeta.destroyFixed(doc, name, callback);
};

AttachmentOperations.destroy = (Model, id, name, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, name });
    if (err)
        callback(err);
    else
        AttachmentMeta.destroy(Model, id, name, callback);
};

module.exports = AttachmentOperations;
