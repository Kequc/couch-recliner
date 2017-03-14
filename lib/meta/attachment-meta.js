'use strict';
const needle = require('needle');

const DocMeta = require('./doc-meta');
const Res = require('./res');
const Err = require('../err');

const AttachmentMeta = {};

AttachmentMeta.readFixed = (doc, name, callback) => {
    AttachmentMeta.read(doc.constructor, doc.getId(), name, callback);
};

AttachmentMeta.read = (Model, id, name, callback) => {
    const url = Model.db.urlTo(id, name);
    needle.request('GET', url, {}, {}, Res.body('doc', (err, body) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err)
            callback(err);
        else {
            callback(undefined, body); // success
        }
    }));
};

AttachmentMeta.writeFixed = (doc, name, file, callback, tries = 0) => {
    tries++;
    const url = doc.getDb().urlTo(doc.getId(), name) + '?rev=' + doc._latestRev;
    needle.request('PUT', url, { file }, { multipart: true, json: true }, Res.body('doc', (err, body) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err && tries <= doc.getDb().MAX_TRIES && err.name === 'conflict') {
            DocMeta.headFixed(doc, (err) => {
                if (err)
                    callback(err);
                else
                    AttachmentMeta.writeFixed(doc, name, file, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else {
            doc.body._attachments = doc.body._attachments || {};
            doc.body._attachments[name] = {
                content_type: file.content_type,
                stub: true
            };
            doc._latestRev = body.rev;
            callback(); // success
        }
    }));
};

AttachmentMeta.write = (Model, id, name, file, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        if (err)
            callback(err);
        else {
            const url = Model.db.urlTo(id, name) + '?rev=' + rev;
            needle.request('PUT', url, { file }, { multipart: true, json: true }, Res.err('doc', (err) => {
                if (err && err.name === 'no_db_file')
                    callback(Err.missing('doc', err.raw));
                else if (err && tries <= Model.db.MAX_TRIES && err.name === 'conflict')
                    AttachmentMeta.write(Model, id, name, file, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(); // success
            }));
        }
    });
};

AttachmentMeta.destroyFixed = (doc, name, callback, tries = 0) => {
    tries++;
    const url = doc.getDb().urlTo(doc.getId(), name) + '?rev=' + doc._latestRev;
    needle.request('DELETE', url, {}, { json: true }, Res.body('doc', (err, body) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err && tries <= doc.getDb().MAX_TRIES && err.name === 'conflict') {
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
            if (doc.body._attachments)
                delete doc.body._attachments[name];
            doc._latestRev = body.rev;
            callback(); // success
        }
    }));
};

AttachmentMeta.destroy = (Model, id, name, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        if (err)
            callback(err);
        else {
            const url = Model.db.urlTo(id, name) + '?rev=' + rev;
            needle.request('DELETE', url, {}, { json: true }, Res.err('doc', (err) => {
                if (err && err.name === 'no_db_file')
                    callback(Err.missing('doc', err.raw));
                else if (err && tries <= Model.db.MAX_TRIES && err.name === 'conflict')
                    AttachmentMeta.destroy(Model, id, name, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(); // success
            }));
        }
    });
};

module.exports = AttachmentMeta;
