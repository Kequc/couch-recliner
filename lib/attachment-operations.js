'use strict';
const AttachmentMeta = require('./meta/attachment-meta');
const Attachment = require('./models/attachment');
const Err = require('./models/err');

const AttachmentOperations = {};

AttachmentOperations.readFixed = (doc, name, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc, { name });
    if (err) {
        callback(err);
    } else
        AttachmentMeta.readFixed(doc, name, callback);
};

AttachmentOperations.read = (Model, id, name, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, name });
    if (err) {
        callback(err);
    } else
        AttachmentMeta.read(Model, id, name, callback);
};

AttachmentOperations.writeFixed = (doc, name, attachment, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc, { name, attachment });
    if (!(attachment instanceof Attachment)) attachment = new Attachment(attachment);
    if (err)
        callback(err);
    else if (!attachment.isValid())
        callback(Err.invalidParam('attachment'));
    else
        AttachmentMeta.writeFixed(doc, name, attachment, callback);
};

AttachmentOperations.write = (Model, id, name, attachment, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, name, attachment });
    if (!(attachment instanceof Attachment)) attachment = new Attachment(attachment);
    if (err)
        callback(err);
    else if (!attachment.isValid())
        callback(Err.invalidParam('attachment'));
    else
        AttachmentMeta.write(Model, id, name, attachment, callback);
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
