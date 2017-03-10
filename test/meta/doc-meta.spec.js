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
        it('read', function(done) {
            DocMeta.read(Helpers.Model, Helpers.data.id, (err) => {
                expect(err).to.not.be.undefined;
                expect(err.name).to.equal('not_found');
                done();
            });
        });
        it('headFixed', function(done) {
            DocMeta.headFixed(Helpers.GENERATE_DOC(), (err) => {
                expect(err).to.not.be.undefined;
                expect(err.name).to.equal('not_found');
                done();
            });
        });
        it('head', function(done) {
            DocMeta.head(Helpers.Model, Helpers.data.id, (err) => {
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
            it('read', function(done) {
                DocMeta.read(Helpers.Model, Helpers.data.id, (err) => {
                    expect(err).to.not.be.undefined;
                    expect(err.name).to.equal('not_found');
                    done();
                });
            });
            it('headFixed', function(done) {
                DocMeta.headFixed(Helpers.GENERATE_DOC(), (err) => {
                    expect(err).to.not.be.undefined;
                    expect(err.name).to.equal('not_found');
                    done();
                });
            });
            it('head', function(done) {
                DocMeta.head(Helpers.Model, Helpers.data.id, (err) => {
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
                Helpers.CHANGE_DOC(doc, (doc2) => {
                    DocMeta.readFixed(doc, (err) => {
                        expect(err).to.be.undefined;
                        expect(doc.getId()).to.equal(doc2.getId());
                        expect(doc.getRev()).to.equal(doc2.getRev());
                        expect(doc._latestRev).to.equal(doc.getRev());
                        expect(doc.body.race).to.equal(doc2.body.race);
                        done();
                    });
                });
            });
            it('read', function(done) {
                Helpers.CHANGE_DOC(doc, (doc2) => {
                    DocMeta.read(Helpers.Model, doc.getId(), (err, doc3) => {
                        expect(err).to.be.undefined;
                        expect(doc3.getId()).to.equal(doc2.getId());
                        expect(doc3.getRev()).to.equal(doc2.getRev());
                        expect(doc3._latestRev).to.equal(doc3.getRev());
                        expect(doc3.body.race).to.equal(doc2.body.race);
                        done();
                    });
                });
            });
            it('headFixed', function(done) {
                Helpers.CHANGE_DOC(doc, (doc2) => {
                    DocMeta.headFixed(doc, (err) => {
                        expect(err).to.be.undefined;
                        expect(doc.getId()).to.equal(doc2.getId());
                        expect(doc.getRev()).to.not.equal(doc2.getRev());
                        expect(doc._latestRev).to.not.equal(doc.getRev());
                        expect(doc._latestRev).to.equal(doc2.getRev());
                        expect(doc.body.race).to.not.equal(doc2.body.race);
                        done();
                    });
                });
            });
            it('head', function(done) {
                Helpers.CHANGE_DOC(doc, (doc2) => {
                    DocMeta.head(Helpers.Model, doc.getId(), (err, rev) => {
                        expect(err).to.be.undefined;
                        expect(rev).to.equal(doc2.getRev());
                        expect(rev).to.equal(doc2._latestRev);
                        done();
                    });
                });
            });
        });
    });
});
