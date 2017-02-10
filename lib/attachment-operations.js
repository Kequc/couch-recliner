'use strict';
const AttachmentMeta = require('./meta/attachment-meta');
const Err = require('./err');

const AttachmentOperations = {};

AttachmentOperations.readDoc = (doc, name, callback = ()=>{}) => {
    const err = Err.checkOpsDoc(doc, { name });
    if (err) {
        callback(err); return devNull;
    } else
        return AttachmentMeta.readDoc(doc, name, callback);
}

AttachmentOperations.read = (Model, id, name, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, name });
    if (err) {
        callback(err); return devNull;
    } else
        return AttachmentMeta.read(id, name, callback);
}

AttachmentOperations.writeDoc = (doc, name, data, mimeType, callback = ()=>{}) => {
    const err = Err.checkOpsDoc(doc, { name, data, mimeType });
    if (err)
        callback(err);
    else
        return AttachmentMeta.writeDoc(doc, name, data, mimeType, callback);
}

AttachmentOperations.write = (Model, id, name, data, mimeType, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, name, data, mimeType, });
    if (err)
        callback(err);
    else
        AttachmentMeta.write(Model, id, name, data, mimeType, callback);
}

AttachmentOperations.destroyDoc = (doc, name, callback = ()=>{}) => {
    const err = Err.checkOpsDoc(doc, { name });
    if (err)
        callback(err);
    else
        AttachmentMeta.destroyDoc(doc, name, callback);
}

AttachmentOperations.destroy = (Model, id, name, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, name });
    if (err)
        callback(err);
    else
        AttachmentMeta.destroy(Model, id, name, callback);
}

module.exports = AttachmentOperations;
