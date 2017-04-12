'use strict';
const Body = require('../models/body');

const DocMutator = {};

DocMutator.updateLatestRev = (doc, rev) => {
    doc._latestRev = rev;
};

DocMutator.eraseLatestRev = (doc) => {
    doc._latestRev = undefined;
};

DocMutator.updateRev = (doc, rev) => {
    doc._body._rev = rev;
};

DocMutator.update = (doc, body, rev, latestRev) => {
    if (!(body instanceof Body)) body = new Body(doc.id, body);
    doc._body = body.forDoc(rev);
    DocMutator.updateLatestRev(doc, latestRev);
};

DocMutator.eraseAttachment = (doc, attname, latestRev) => {
    if (doc.body._attachments)
        delete doc.body._attachments[attname];
    DocMutator.updateLatestRev(doc, latestRev);
};

DocMutator.updateAttachment = (doc, attname, attachment, latestRev) => {
    doc.body._attachments = doc.body._attachments || {};
    doc.body._attachments[attname] = attachment.toStub();
    DocMutator.updateLatestRev(doc, latestRev);
};

DocMutator.build = (Model, body, _id, rev, latestRev) => {
    const doc = new Model();
    doc._body = { _id };
    DocMutator.update(doc, body, rev, latestRev);
    return doc;
};

DocMutator.erase = (doc) => {
    doc._body = {};
    doc._latestRev = undefined;
};

module.exports = DocMutator;
