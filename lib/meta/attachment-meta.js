'use strict';
const DocMeta = require('./doc-meta');
const MAX_TRIES = 5;

const AttachmentMeta = {};

AttachmentMeta.readFixed = (doc, name, callback) => {
    return doc.getDb().readAttachment(doc.getId(), name, callback);
}

AttachmentMeta.read = (Model, id, name, callback) => {
    return Model.db.readAttachment(id, name, callback);
}

AttachmentMeta.writeFixed = (doc, name, data, mimeType, callback, tries = 0) => {
    tries++;
    return doc.getDb().write(doc.getId(), doc._latestRev, name, data, mimeType, (err, result) => {
        if (err && tries <= MAX_TRIES && err.name === 'conflict') {
            DocMeta.headFixed(doc, (err) => {
                if (err)
                    callback(err);
                else
                    AttachmentMeta.writeFixed(doc, name, data, mimeType, callback, tries);
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

AttachmentMeta.write = (Model, id, name, data, mimeType, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        if (err)
            callback(err);
        else {
            Model.db.write(id, rev, name, data, mimeType, (err) => {
                if (err && tries <= this.doc.db.maxTries && err.name === 'conflict')
                    AttachmentMeta.write(Model, id, name, data, mimeType, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(); // successfully written
            });
        }
    });
}

AttachmentMeta.destroyFixed = (doc, name, callback, tries = 0) => {
    tries++;
    doc.getDb().destroyAttachment(doc.getId(), doc._latestRev, name, (err, result) => {
        if (err && tries <= this.doc.db.maxTries && err.name === 'conflict') {
            DocMeta.headFixed(doc, (err) => {
                if (err)
                    callback(err);
                else
                    AttachmentMeta.destroyFixed(doc, name, callback, tries);
            });
        }
        else if (err)
            callback(err);
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

AttachmentMeta.destroy = (Model, id, name, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        if (err)
            callback(err);
        else {
            Model.db.destroyAttachment(id, rev, name, (err) => {
                if (err && tries <= this.doc.db.maxTries && err.name === 'conflict')
                    AttachmentMeta.destroy(Model, id, name, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(); // successfully destroyed
            });
        }
    });
}

module.exports = AttachmentMeta;
