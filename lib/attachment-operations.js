'use strict';
const AttachmentMeta = require('./meta/attachment-meta');
const Attachment = require('./models/attachment');
const Err = require('./models/err');

const AttachmentOperations = {};

AttachmentOperations.read = (Model, id, attname, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, attname });
    if (err)
        callback(err);
    else if (typeof id !== 'string')
        callback(Err.invalidParam('id'));
    else if (typeof attname !== 'string')
        callback(Err.invalidParam('attname'));
    else
        AttachmentMeta.read(Model, id, attname, callback);
};

AttachmentOperations.readFixed = (doc, attname, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc, { attname });
    if (err)
        callback(err);
    else if (typeof attname !== 'string')
        callback(Err.invalidParam('attname'));
    else
        AttachmentMeta.readFixed(doc, attname, callback);
};

AttachmentOperations.write = (Model, id, attname, attachment, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, attname, attachment });
    if (!(attachment instanceof Attachment)) attachment = new Attachment(attachment);
    if (err)
        callback(err);
    else if (typeof id !== 'string')
        callback(Err.invalidParam('id'));
    else if (typeof attname !== 'string')
        callback(Err.invalidParam('attname'));
    else if (!attachment.isValid())
        callback(Err.invalidParam('attachment'));
    else
        AttachmentMeta.write(Model, id, attname, attachment, callback);
};

AttachmentOperations.writeFixed = (doc, attname, attachment, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc, { attname, attachment });
    if (!(attachment instanceof Attachment)) attachment = new Attachment(attachment);
    if (err)
        callback(err);
    else if (typeof attname !== 'string')
        callback(Err.invalidParam('attname'));
    else if (!attachment.isValid())
        callback(Err.invalidParam('attachment'));
    else
        AttachmentMeta.writeFixed(doc, attname, attachment, callback);
};

AttachmentOperations.destroy = (Model, id, attname, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, attname });
    if (err)
        callback(err);
    else if (typeof id !== 'string')
        callback(Err.invalidParam('id'));
    else if (typeof attname !== 'string')
        callback(Err.invalidParam('attname'));
    else
        AttachmentMeta.destroy(Model, id, attname, callback);
};

AttachmentOperations.destroyFixed = (doc, attname, callback = ()=>{}) => {
    const err = Err.checkOpsFixed(doc, { attname });
    if (err)
        callback(err);
    else if (typeof attname !== 'string')
        callback(Err.invalidParam('attname'));
    else
        AttachmentMeta.destroyFixed(doc, attname, callback);
};

module.exports = AttachmentOperations;
