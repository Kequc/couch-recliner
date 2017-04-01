'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

const CouchRecliner = require('../lib');

const Helpers = {};

Helpers.data = {
    dbName: 'couch-recliner',
    id: 'fake-id',
    attname: 'fake-attachment.txt',
    file: {
        content_type: 'text/html',
        body: fs.readFileSync(path.join(__dirname, './data/attachment.txt'))
    },
    file2: {
        content_type: 'text/html',
        body: fs.readFileSync(path.join(__dirname, './data/attachment2.txt'))
    },
    rev: '1-fake-rev',
    doc: require('./data/doc.json'),
    doc2: require('./data/doc2.json')
};

class Model extends CouchRecliner.Model {}
Model.dbName = Helpers.data.dbName;
Helpers.Model = Model;

Helpers.DESTROY_DB = (done) => {
    CouchRecliner.DbOperations.destroy(Model, '_DESTROY_', (err) => {
        if (err)
            expect(err.name).to.equal('no_db_file');
        else
            expect(err).to.be.undefined;
        done();
    });
};

Helpers.CREATE_DB = (done) => {
    CouchRecliner.DbOperations.create(Model, (err) => {
        if (err)
            expect(err.name).to.equal('db_already_exists');
        else
            expect(err).to.be.undefined;
        done();
    });
};

Helpers.EXPECT_DB = (exists, done) => {
    CouchRecliner.DbOperations.head(Model, (err) => {
        if (exists)
            expect(err).to.be.undefined;
        else {
            expect(err).to.not.be.undefined;
            expect(err.name).to.equal('no_db_file');
        }
        done();
    });
};

Helpers.GENERATE_DOC = () => {
    return new Helpers.Model(Helpers.data.doc, {
        id: Helpers.data.id,
        rev: Helpers.data.rev
    });
};

Helpers.DESTROY_DOC = (done) => {
    CouchRecliner.DocOperations.destroy(Model, Helpers.data.id, (err) => {
        if (err)
            expect(err.name).to.equal('not_found');
        else
            expect(err).to.be.undefined;
        done();
    });
};

Helpers.CREATE_DOC = (callback) => {
    CouchRecliner.DocOperations.write(Model, Helpers.data.id, Helpers.data.doc, (err, doc) => {
        expect(err).to.be.undefined;
        callback(doc);
    });
};

Helpers.CREATE_DOC_WITH_ATTACHMENT = (callback) => {
    const _attachments = {
        [Helpers.data.attname]: Helpers.data.file
    };
    const body = Object.assign({}, Helpers.data.doc, { _attachments });
    CouchRecliner.DocOperations.write(Model, Helpers.data.id, body, (err, doc) => {
        expect(err).to.be.undefined;
        callback(doc);
    });
};

Helpers.EXPECT_REV = (doc, oldRev, changed = false) => {
    if (changed)
        expect(doc.getRev()).to.not.equal(oldRev);
    else
        expect(doc.getRev()).to.equal(oldRev);
};

Helpers.EXPECT_LATEST_REV = (doc, expected = doc.getRev()) => {
    if (expected === false)
        expect(doc._latestRev).to.not.equal(expected);
    else
        expect(doc._latestRev).to.equal(expected);
};

Helpers.EXPECT_DOC = (body, done, id = Helpers.data.id) => {
    CouchRecliner.DocOperations.read(Model, id, (err, doc) => {
        if (body) {
            expect(err).to.be.undefined;
            Helpers.EXPECT_DOC_BODY(doc.body, body);
        }
        else {
            expect(err).to.not.be.undefined;
            expect(err.name).to.equal('not_found');
        }
        done();
    });
};

Helpers.EXPECT_ATTACHMENT = (buffer, done, id = Helpers.data.id, attname = Helpers.data.attname) => {
    CouchRecliner.AttachmentOperations.read(Model, id, attname, (err, body) => {
        if (buffer) {
            expect(err).to.be.undefined;
            Helpers.EXPECT_ATTACHMENT_BODY(body, buffer);
        }
        else {
            expect(err).to.not.be.undefined;
            expect(err.name).to.equal('not_found');
        }
        done();
    });
};

Helpers.EXPECT_ATTACHMENT_STUB = (doc, attname = Helpers.data.attname) => {
    if (attname === false)
        expect((doc.body._attachments || {})[attname]).to.be.undefined;
    else {
        expect(doc.body._attachments).to.not.be.undefined;
        expect(doc.body._attachments[attname]).to.not.be.undefined;
        expect(doc.body._attachments[attname].stub).to.be.true;
    }
};

Helpers.EXPECT_ATTACHMENT_BODY = (buffer, buffer2 = Helpers.data.file.body) => {
    const body = String.fromCharCode(null, buffer);
    const body2 = String.fromCharCode(null, buffer2);
    expect(body).to.eql(body2);
};

Helpers.EXPECT_DOC_BODY = (data, data2) => {
    const body = Object.assign({}, data, { _id: undefined, _rev: undefined, _attachments: undefined });
    const body2 = Object.assign({}, data2, { _id: undefined, _rev: undefined, _attachments: undefined });
    expect(body).to.eql(body2);
};

Helpers.EXPECT_SAME_DOC = (doc1, doc2) => {
    expect(doc1.getId()).to.equal(doc2.getId());
};

Helpers.CHANGE_DOC = (doc, callback) => {
    CouchRecliner.DocOperations.update(Model, doc.getId(), { race: 'cat' }, (err, doc2) => {
        expect(err).to.be.undefined;
        expect(doc.getId()).to.equal(doc2.getId());
        expect(doc.getRev()).to.not.equal(doc2.getRev());
        expect(doc._latestRev).to.not.equal(doc2.getRev());
        expect(doc.body.race).to.not.equal(doc2.body.race);
        callback(doc2);
    });
};

Helpers.EXPECT_ERROR = (err, name) => {
    if (name) {
        expect(err).is.not.undefined;
        expect(err.name).to.equal(name);
    } else
        expect(err).to.be.undefined;
};

module.exports = Helpers;
