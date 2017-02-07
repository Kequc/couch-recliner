"use strict";
const Err = require('../err');

const AttachmentOperations = {};

AttachmentOperations.readDoc = (doc, name, callback = ()=>{}) => {
    AttachmentOperations.read(doc.constructor, doc.getId(), name, callback);
}

AttachmentOperations.createReadStreamDoc = (doc, name, callback = ()=>{}) => {
    return AttachmentOperations.createReadStream(doc.constructor, doc.getId(), name, callback);
}

AttachmentOperations.writeDoc = (doc, name, data, mimeType, callback = ()=>{}) => {
    if (!doc.getId())
        callback(Err.missingId('doc'));
    else if (!name)
        callback(Err.missingParam('attachment', "name"));
    else if (!data)
        callback(Err.missingParam('attachment', "data"));
    else if (!mimeType)
        callback(Err.missingParam('attachment', "mimeType"));
    else
        _writeDoc(doc, name, data, mimeType, callback);
}

function _writeDoc(doc, name, data, mimeType, callback, tries = 0) {
    tries++;
    _performWrite(doc.constructor, doc.getId(), doc._latestRev, name, data, mimeType, (err, result) => {
        if (err && tries <= MAX_TRIES && err.name == "conflict") {
            DocOperations.headDoc(doc, (err) => {
                if (err)
                    callback(err);
                else
                    _writeDoc(doc, name, data, mimeType, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else {
            // attachment written
            // TODO: Is there more information available here?
            doc.body['_attachments'] = doc.body['_attachments'] || {};
            doc.body['_attachments'][name] = {};
            // we are intentionally not storing the new rev on the document
            doc._latestRev = result['rev'];
            callback();
        }
    });
}

AttachmentOperations.createWriteStreamDoc = (doc, name, mimeType, callback = ()=>{}) => {
    if (!doc.getId()) {
        callback(Err.missingId('doc'));
        return devNull();
    }
    else if (!name) {
        callback(Err.missingParam('attachment', "name"));
        return devNull();
    }
    else if (!mimeType) {
        callback(Err.missingParam('attachment', "mimeType"));
        return devNull();
    }
    else {
        return _performCreateWriteStream(doc.constructor, doc.getId(), doc._latestRev, name, undefined, mimeType, (err, result) => {
            if (err)
                callback(err);
            else {
                // attachment written
                // TODO: Is there more information available here?
                doc.body['_attachments'] = doc.body['_attachments'] || {};
                doc.body['_attachments'][name] = {};
                // we are intentionally not storing the new rev on the document
                doc._latestRev = result['rev'];
                callback();
            }
        });
    }
}

function _performCreateWriteStream(Model, id, rev, name, data, mimeType, callback) {
    return Model.scope.attachment.insert(id, name, data, mimeType, { rev: rev }, Err.resultFunc('attachment', callback));
}

AttachmentOperations.destroyDoc = (doc, name, callback = ()=>{}) => {
    if (!doc.getId())
        callback(Err.missingId('doc'));
    else if (!name)
        callback(Err.missingParam('attachment', "name"));
    else
        _destroyDoc(doc, name, callback);
}

function _destroyDoc(doc, name, callback, tries = 0) {
    tries++;
    _performDestroy(doc.constructor, doc.getId(), doc._latestRev, name, (err, result) => {
        if (err) {
            if (tries <= this.doc.db.maxTries && err.name == "conflict") {
                DocOperations.headDoc(doc, (err) => {
                    if (err)
                        callback(err);
                    else
                        _destroyDoc(doc, name, callback, tries);
                });
            }
            else
                callback(err);
        }
        else {
            // attachment removed
            if (doc.body['_attachments'])
                delete doc.body['_attachments'][name];
            // we are intentionally not storing the new rev of the document
            doc._latestRev = result['rev'];
            callback();
        }
    });
}

AttachmentOperations.listDoc = (doc) => {
    const attachments = [];
    for (const name in (doc.body['_attachments'] || {})) {
        attachments.push(name);
    }
    return attachments;
}

AttachmentOperations.existsDoc = (doc, name) => {
    return !!(doc.body['_attachments'] && doc.body['_attachments'][name]);
}

AttachmentOperations.read = (Model, id, name, callback = ()=>{}) => {
    if (!id)
        callback(Err.missingId('attachment'));
    else if (!name)
        callback(Err.missingParam('attachment', "name"));
    else
        _performRead(Model, id, name, callback);
}

function _performRead(Model, id, name, callback) {
    Model.scope.attachment.get(id, name, {}, Err.resultFunc('attachment', callback));
}

AttachmentOperations.createReadStream = (Model, id, name, callback = ()=>{}) => {
    if (!id) {
        callback(Err.missingId('attachment'));
        return _emptyStream();
    }
    else if (!name) {
        callback(Err.missingParam('attachment', "name"));
        return _emptyStream();
    }
    else
        return _performCreateReadStream(Model, id, name, callback);
}

function _performCreateReadStream(Model, id, name, callback) {
    // TODO: truthfully this returns pretty ugly streams when there is an error
    // would be nice to clean up
    return Model.scope.attachment.get(Model, id, name, {}, Err.resultFunc('attachment', callback));
}

AttachmentOperations.write = (Model, id, name, data, mimeType, callback = ()=>{}) => {
    if (!id)
        callback(Err.missingId('attachment'));
    else if (!name)
        callback(Err.missingParam('attachment', "name"));
    else if (!data)
        callback(Err.missingParam('attachment', "data"));
    else if (!mimeType)
        callback(Err.missingParam('attachment', "mimeType"));
    else
        _write(Model, id, name, data, mimeType, callback);
}

function _write(Model, id, name, data, mimeType, callback, tries = 0) {
    tries++;
    DocOperations.head(Model, id, (err, rev) => {
        if (err)
            callback(err);
        else {
            _performWrite(Model, id, rev, name, data, mimeType, (err) => {
                if (err && tries <= this.doc.db.maxTries && err.name == "conflict")
                    _write(Model, id, name, data, mimeType, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(); // successfully written
            });
        }
    });
}

function _performWrite(Model, id, rev, name, data, mimeType, callback) {
    Model.scope.attachment.insert(id, name, data, mimeType, { rev: rev }, Err.resultFunc('attachment', callback));
}

AttachmentOperations.destroy = (Model, id, name, callback = ()=>{}) => {
    if (!id)
        callback(Err.missingId('attachment'));
    else if (!name)
        callback(Err.missingParam('attachment', "name"));
    else
        _destroy(Model, id, name, callback);
}

function _destroy(Model, id, name, callback, tries = 0) {
    tries++;
    DocOperations.head(Model, id, (err, rev) => {
        if (err)
            callback(err);
        else {
            _performDestroy(Model, id, rev, name, (err) => {
                if (err && tries <= this.doc.db.maxTries && err.name == "conflict")
                    _destroy(Model, id, name, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(); // successfully destroyed
            });
        }
    });
}

function _performDestroy(Model, id, rev, name, callback) {
    Model.scope.attachment.destroy(id, name, { rev: rev }, Err.resultFunc('attachment', callback));
}

module.exports = AttachmentOperations;
