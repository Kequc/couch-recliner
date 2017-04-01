'use strict';
const DocMeta = require('./doc-meta');
const Res = require('../util/res');
const Http = require('../util/http');
const Err = require('../util/err');
const Attachment = require('../util/attachment');

const AttachmentMeta = {};

AttachmentMeta.readFixed = (doc, attname, callback) => {
    AttachmentMeta.read(doc.constructor, doc.getId(), attname, callback);
};

AttachmentMeta.read = (Model, id, attname, callback) => {
    const options = {
        method: 'GET',
        url: Model.urlTo(id, attname)
    };
    Http.rawRequest(options, Res.body('doc', (err, body) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err)
            callback(err);
        else {
            callback(undefined, body); // success
        }
    }));
};

AttachmentMeta.writeFixed = (doc, attname, data, callback, tries = 0) => {
    tries++;
    const atta = new Attachment(attname, data);
    const options = {
        method: 'PUT',
        url: doc.constructor.urlTo(doc.getId(), attname),
        qs: { rev: doc._latestRev },
        body: atta.body
    };
    Http.rawRequest(options, Res.body('doc', (err, body) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err && tries <= doc.constructor.MAX_TRIES && err.name === 'conflict') {
            DocMeta.headFixed(doc, (err) => {
                if (err)
                    callback(err);
                else
                    AttachmentMeta.writeFixed(doc, attname, data, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else {
            doc.body._attachments = doc.body._attachments || {};
            doc.body._attachments[attname] = atta.toStub();
            doc._latestRev = body.rev;
            callback(); // success
        }
    }));
};

AttachmentMeta.write = (Model, id, attname, data, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        if (err)
            callback(err);
        else {
            const atta = new Attachment(attname, data);
            const options = {
                method: 'PUT',
                url: Model.urlTo(id, attname),
                qs: { rev },
                body: atta.body
            };
            Http.rawRequest(options, Res.err('doc', (err) => {
                if (err && err.name === 'no_db_file')
                    callback(Err.missing('doc', err.raw));
                else if (err && tries <= Model.db.MAX_TRIES && err.name === 'conflict')
                    AttachmentMeta.write(Model, id, attname, data, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(); // success
            }));
        }
    });
};

AttachmentMeta.destroyFixed = (doc, attname, callback, tries = 0) => {
    tries++;
    const options = {
        method: 'DELETE',
        url: doc.constructor.urlTo(doc.getId(), attname),
        qs: { rev: doc._latestRev }
    };
    Http.rawRequest(options, Res.body('doc', (err, body) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err && tries <= doc.constructor.MAX_TRIES && err.name === 'conflict') {
            DocMeta.headFixed(doc, (err) => {
                if (err)
                    callback(err);
                else
                    AttachmentMeta.destroyFixed(doc, attname, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else {
            if (doc.body._attachments)
                delete doc.body._attachments[attname];
            doc._latestRev = body.rev;
            callback(); // success
        }
    }));
};

AttachmentMeta.destroy = (Model, id, attname, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        if (err)
            callback(err);
        else {
            const options = {
                method: 'DELETE',
                url: Model.urlTo(id, attname),
                qs: { rev }
            };
            Http.rawRequest(options, Res.err('doc', (err) => {
                if (err && err.name === 'no_db_file')
                    callback(Err.missing('doc', err.raw));
                else if (err && tries <= Model.db.MAX_TRIES && err.name === 'conflict')
                    AttachmentMeta.destroy(Model, id, attname, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(); // success
            }));
        }
    });
};

module.exports = AttachmentMeta;
