'use strict';
const devNull = require('dev-null');

const AttachmentMeta = require('./meta/attachment-meta');
const Err = require('./err');

const AttachmentOperations = {};

AttachmentOperations.readFixed = (doc, name, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc, { name });
    if (err) {
        callback(err); return devNull;
    } else
        return AttachmentMeta.readFixed(doc, name, callback);
};

AttachmentOperations.read = (Model, id, name, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, name });
    if (err) {
        callback(err); return devNull;
    } else
        return AttachmentMeta.read(id, name, callback);
};

AttachmentOperations.writeFixed = (doc, name, data, mimeType, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc, { name, data, mimeType });
    if (err) {
        callback(err); return devNull;
    } else
        return AttachmentMeta.writeFixed(doc, name, data, mimeType, callback);
};

AttachmentOperations.write = (Model, id, name, data, mimeType, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, name, data, mimeType, });
    if (err)
        callback(err);
    else
        AttachmentMeta.write(Model, id, name, data, mimeType, callback);
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
