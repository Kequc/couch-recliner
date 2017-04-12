'use strict';
const Attachment = require('../models/attachment');

const DocMutator = require('../util/doc-mutator');
const Http = require('../util/http');
const Req = require('../util/req');
const Res = require('../util/res');

const DocMeta = require('./doc-meta');

const AttachmentMeta = {};

AttachmentMeta.readFixed = (doc, attname, callback) => {
    AttachmentMeta.read(doc.constructor, doc.id, attname, callback);
};

AttachmentMeta.read = (Model, id, attname, callback) => {
    const url = Req.urlTo(Model, id, attname);
    Http.rawRequest(Req.get({ url }), Res.body('doc', (err, body) => {
        if (err)
            callback(err);
        else {
            callback(undefined, body); // success
        }
    }));
};

AttachmentMeta.writeFixed = (doc, attname, data, callback, tries = 0) => {
    tries++;
    const attachment = new Attachment(data);
    const url = Req.urlToFixed(doc, attname);
    const body = attachment.body;
    const rev = doc._latestRev;
    Http.request(Req.put({ url, body, qs: { rev } }), Res.body('doc', (err, body) => {
        if (err && tries <= doc.constructor.MAX_TRIES && err.name === 'conflict') {
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
            DocMutator.updateAttachment(doc, attname, attachment, body.rev);
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
            const attachment = new Attachment(data);
            const url = Req.urlTo(Model, id, attname);
            const body = attachment.body;
            Http.request(Req.put({ url, body, qs: { rev } }), Res.err('doc', (err) => {
                if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
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
    const url = Req.urlToFixed(doc, attname);
    const rev = doc._latestRev;
    Http.request(Req.delete({ url, qs: { rev } }), Res.body('doc', (err, body) => {
        if (err && tries <= doc.constructor.MAX_TRIES && err.name === 'conflict') {
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
            DocMutator.eraseAttachment(doc, attname, body.rev);
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
            const url = Req.urlTo(Model, id, attname);
            Http.request(Req.delete({ url, qs: { rev } }), Res.err('doc', (err) => {
                if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
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
