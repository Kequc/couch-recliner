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
    attname2: 'fake-attachment-2.txt',
    update: { race: 'cat' },
    update2: { dog: 'ball' },
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

Helpers.RESET_DB = (done) => {
    CouchRecliner.DbOperations.reset(Model, '_RESET_', (err) => {
        expect(err).to.be.undefined;
        done();
    });
};

Helpers.EXPECT_DB_DOES_NOT_EXIST = (done) => {
    CouchRecliner.DbOperations.head(Model, (err) => {
        Helpers.EXPECT_ERROR(err, 'no_db_file');
        done();
    });
};

Helpers.EXPECT_DB_EXISTS = (done) => {
    CouchRecliner.DbOperations.head(Model, (err) => {
        Helpers.EXPECT_NO_ERROR(err, 'no_db_file');
        done();
    });
};

Helpers.GENERATE_FAKE_DOC = () => {
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
        Helpers.EXPECT_NO_ERROR(err);
        callback(doc);
    });
};

Helpers.EXPECT_REV_CHANGED = (doc, oldRev) => {
    expect(doc.getRev()).to.not.equal(oldRev);
};

Helpers.EXPECT_REV = (doc, rev) => {
    expect(doc.getRev()).to.equal(rev);
};

Helpers.EXPECT_LATEST_REV_CHANGED = (doc, rev) => {
    expect(doc._latestRev).to.not.equal(rev || doc.getRev());
};

Helpers.EXPECT_LATEST_REV = (doc, rev) => {
    expect(doc._latestRev).to.equal(rev || doc.getRev());
};

Helpers.EXPECT_DOC_DOES_NOT_EXIST = (id, done) => {
    CouchRecliner.DocOperations.head(Model, id, (err) => {
        Helpers.EXPECT_ERROR(err, 'not_found');
        done();
    });
};

Helpers.EXPECT_DOC_EXISTS = (id, done) => {
    CouchRecliner.DocOperations.head(Model, id, (err) => {
        Helpers.EXPECT_NO_ERROR(err);
        done();
    });
};

Helpers.EXPECT_DOC_EXISTS_WITH_BODY = (id, body, done) => {
    CouchRecliner.DocOperations.read(Model, id, (err, doc) => {
        Helpers.EXPECT_NO_ERROR(err);
        Helpers.EXPECT_DOC_BODY(doc.body, body);
        done();
    });
};

Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST = (id, attname, done) => {
    CouchRecliner.AttachmentOperations.read(Model, id, attname, (err, body) => {
        Helpers.EXPECT_ERROR(err, 'not_found');
        done();
    });
};

Helpers.EXPECT_ATTACHMENT_EXISTS = (id, attname, done) => {
    CouchRecliner.AttachmentOperations.read(Model, id, attname, (err, body) => {
        Helpers.EXPECT_NO_ERROR(err);
        done();
    });
};

Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER = (id, attname, buffer, done) => {
    CouchRecliner.AttachmentOperations.read(Model, id, attname, (err, body) => {
        Helpers.EXPECT_NO_ERROR(err);
        Helpers.EXPECT_ATTACHMENT_BODY(body, buffer);
        done();
    });
};

Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST = (doc, attname) => {
    expect((doc.body._attachments || {})[attname]).to.be.undefined;
};

Helpers.EXPECT_ATTACHMENT_STUB_EXISTS = (doc, attname) => {
    expect(doc.body._attachments).to.not.be.undefined;
    expect(doc.body._attachments[attname]).to.not.be.undefined;
    expect(doc.body._attachments[attname].stub).to.be.true;
};

Helpers.EXPECT_ATTACHMENT_BODY = (buffer, buffer2) => {
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

Helpers.CHANGE_DOC_IN_BACKGROUND = (doc, callback) => {
    CouchRecliner.DocOperations.update(Model, doc.getId(), Helpers.data.update, (err, doc2) => {
        Helpers.EXPECT_NO_ERROR(err);
        Helpers.EXPECT_SAME_DOC(doc2, doc);
        Helpers.EXPECT_REV_CHANGED(doc2, doc.getRev());
        Helpers.EXPECT_LATEST_REV(doc2);
        Helpers.EXPECT_DOC_BODY(doc2.body, Object.assign({}, doc.body, Helpers.data.update));
        callback(doc2);
    });
};

Helpers.EXPECT_NO_ERROR = (err) => {
    if (err) {
        console.log('UNEXPECTED ERROR:');
        console.log('name', err.name);
        console.log('raw', err.raw);
    }
    expect(err).to.be.undefined;
};

Helpers.EXPECT_ERROR = (err, name) => {
    expect(err).is.not.undefined;
    expect(err.name).to.equal(name);
};

module.exports = Helpers;
