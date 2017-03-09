'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const CouchRecliner = require('../lib');

const Helpers = {};

class Model extends CouchRecliner.Model {}
Model.use('http://localhost:5984', 'couch-recliner');

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

module.exports = Helpers;
