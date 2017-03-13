'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const CouchRecliner = require('../lib');

const Helpers = {};

Helpers.data = {
    dbName: 'couch-recliner',
    id: 'fake-id',
    rev: '1-fake-rev',
    doc: require('./data/doc.json'),
    doc2: require('./data/doc2.json')
};

class Model extends CouchRecliner.Model {}
Model.use('http://localhost:5984', Helpers.data.dbName);

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

Helpers.EXPECT_DOC = (exists, done) => {
    CouchRecliner.DocOperations.head(Model, Helpers.data.id, (err) => {
        if (exists)
            expect(err).to.be.undefined;
        else {
            expect(err).to.not.be.undefined;
            expect(err.name).to.equal('not_found');
        }
        done();
    });
};

Helpers.EXPECT_DOC_BODY = (data, data2) => {
    const body = Object.assign({}, data, { _id: undefined, _rev: undefined });
    const body2 = Object.assign({}, data2, { _id: undefined, _rev: undefined });
    expect(body).to.eql(body2);
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

module.exports = Helpers;
