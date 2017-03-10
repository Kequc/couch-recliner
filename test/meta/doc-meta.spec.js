'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const DocMeta = require('../../lib/meta/doc-meta');
const Helpers = require('../Helpers');

describe('DocMeta', function() {
    beforeEach(Helpers.DESTROY_DB);
    describe('database does not exist', function() {
        it('readFixed', function(done) {
            DocMeta.readFixed(Helpers.GENERATE_DOC(), (err) => {
                expect(err).to.not.be.undefined;
                expect(err.name).to.equal('not_found');
                done();
            });
        });
    });
    describe('database exists', function() {
        beforeEach(Helpers.CREATE_DB);
        describe('document does not exist', function() {
            it('readFixed', function(done) {
                DocMeta.readFixed(Helpers.GENERATE_DOC(), (err) => {
                    expect(err).to.not.be.undefined;
                    expect(err.name).to.equal('not_found');
                    done();
                });
            });
        });
        describe('document exists', function() {
            let doc;
            beforeEach(function(done) {
                Helpers.CREATE_DOC(model => { doc = model; done(); });
            });
            it('readFixed', function(done) {
                DocMeta.update(Helpers.Model, doc.getId(), { race: 'cat' }, (err, doc2) => {
                    expect(err).to.be.undefined;
                    expect(doc.getId() === doc2.getId()).to.be.true;
                    expect(doc.getRev() === doc2.getRev()).to.be.false;
                    expect(doc.body.race === doc2.body.race).to.be.false;
                    DocMeta.readFixed(doc, (err) => {
                        expect(err).to.be.undefined;
                        expect(doc.getId() === doc2.getId()).to.be.true;
                        expect(doc.getRev() === doc2.getRev()).to.be.true;
                        expect(doc.getRev() === doc._latestRev).to.be.true;
                        expect(doc.body.race === doc2.body.race).to.be.true;
                        done();
                    });
                });
            });
        });
    });
});
