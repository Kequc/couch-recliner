'use strict';
const Body = require('../models/body');

const DocMutator = {};

DocMutator.build = (Model, body, id, rev, latestRev) => {
    const doc = new Model();
    doc._id = id;
    DocMutator.update(doc, body, rev, latestRev);
    return doc;
};

DocMutator.update = (doc, body, rev, latestRev) => {
    if (!(body instanceof Body)) body = new Body(body);
    doc._body = body.forDoc();
    doc._rev = rev;
    DocMutator.updateLatestRev(doc, latestRev);
};

DocMutator.erase = (doc) => {
    doc._body = {};
    doc._id = undefined;
    doc._rev = undefined;
    doc._latestRev = undefined;
};

DocMutator.updateAttachment = (doc, attname, attachment, latestRev) => {
    doc.body._attachments = doc.body._attachments || {};
    doc.body._attachments[attname] = attachment.toStub();
    DocMutator.updateLatestRev(doc, latestRev);
};

DocMutator.eraseAttachment = (doc, attname, latestRev) => {
    if (doc.body._attachments)
        delete doc.body._attachments[attname];
    DocMutator.updateLatestRev(doc, latestRev);
};

DocMutator.updateLatestRev = (doc, rev) => {
    doc._latestRev = rev;
};

DocMutator.eraseLatestRev = (doc) => {
    doc._latestRev = undefined;
};

module.exports = DocMutator;
