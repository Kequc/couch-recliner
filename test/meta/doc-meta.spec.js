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
        it('writeFixed', function(done) {
            const doc = Helpers.GENERATE_DOC();
            const oldRev = doc.getRev();
            DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                expect(err).to.be.undefined;
                expect(doc.getRev()).to.not.equal(oldRev);
                expect(doc._latestRev).to.equal(doc.getRev());
                Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                Helpers.EXPECT_DOC(true, done);
            });
        });
        it('write', function(done) {
            DocMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.doc2, (err, doc2) => {
                expect(err).to.be.undefined;
                expect(doc2._latestRev).to.equal(doc2.getRev());
                Helpers.EXPECT_DOC_BODY(doc2.body, Helpers.data.doc2);
                Helpers.EXPECT_DOC(true, done);
            });
        });
        it('updateFixed', function(done) {
            const doc = Helpers.GENERATE_DOC();
            const oldRev = doc.getRev();
            DocMeta.updateFixed(doc, { race: 'dog' }, (err) => {
                expect(err).to.not.be.undefined;
                expect(err.name).to.equal('not_found');
                expect(doc.getRev()).to.equal(oldRev);
                Helpers.EXPECT_DOC(false, done);
            });
        });
        it('update', function(done) {
            DocMeta.update(Helpers.Model, Helpers.data.id, { race: 'dog' }, (err) => {
                expect(err).to.not.be.undefined;
                expect(err.name).to.equal('not_found');
                Helpers.EXPECT_DOC(false, done);
            });
        });
        it('updateOrWrite', function(done) {
            DocMeta.updateOrWrite(Helpers.Model, Helpers.data.id, Helpers.data.doc2, (err, doc2) => {
                expect(err).to.be.undefined;
                expect(doc2._latestRev).to.equal(doc2.getRev());
                Helpers.EXPECT_DOC_BODY(doc2.body, Helpers.data.doc2);
                Helpers.EXPECT_DOC(true, done);
            });
        });
        it('create', function(done) {
            DocMeta.create(Helpers.Model, Helpers.data.doc2, (err, doc2) => {
                expect(err).to.be.undefined;
                expect(doc2._latestRev).to.equal(doc2.getRev());
                Helpers.EXPECT_DOC_BODY(doc2.body, Helpers.data.doc2);
                Helpers.EXPECT_DOC(true, done, doc2.getId());
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
            it('writeFixed', function(done) {
                const doc = Helpers.GENERATE_DOC();
                const oldRev = doc.getRev();
                DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                    expect(err).to.be.undefined;
                    expect(doc.getRev()).to.not.equal(oldRev);
                    expect(doc._latestRev).to.equal(doc.getRev());
                    Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                    Helpers.EXPECT_DOC(true, done);
                });
            });
            it('write', function(done) {
                DocMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.doc2, (err, doc2) => {
                    expect(err).to.be.undefined;
                    expect(doc2._latestRev).to.equal(doc2.getRev());
                    Helpers.EXPECT_DOC_BODY(doc2.body, Helpers.data.doc2);
                    Helpers.EXPECT_DOC(true, done);
                });
            });
            it('updateFixed', function(done) {
                const doc = Helpers.GENERATE_DOC();
                const oldRev = doc.getRev();
                DocMeta.updateFixed(doc, { race: 'dog' }, (err) => {
                    expect(doc.getRev()).to.equal(oldRev);
                    expect(err).to.not.be.undefined;
                    expect(err.name).to.equal('not_found');
                    expect(doc.getRev()).to.equal(oldRev);
                    Helpers.EXPECT_DOC(false, done);
                });
            });
            it('update', function(done) {
                DocMeta.update(Helpers.Model, Helpers.data.id, { race: 'dog' }, (err, doc2) => {
                    expect(err).to.not.be.undefined;
                    expect(err.name).to.equal('not_found');
                    Helpers.EXPECT_DOC(false, done);
                });
            });
            it('updateOrWrite', function(done) {
                DocMeta.updateOrWrite(Helpers.Model, Helpers.data.id, Helpers.data.doc2, (err, doc2) => {
                    expect(err).to.be.undefined;
                    expect(doc2._latestRev).to.equal(doc2.getRev());
                    Helpers.EXPECT_DOC_BODY(doc2.body, Helpers.data.doc2);
                    Helpers.EXPECT_DOC(true, done);
                });
            });
            it('create', function(done) {
                DocMeta.create(Helpers.Model, Helpers.data.doc2, (err, doc2) => {
                    expect(err).to.be.undefined;
                    expect(doc2._latestRev).to.equal(doc2.getRev());
                    Helpers.EXPECT_DOC_BODY(doc2.body, Helpers.data.doc2);
                    Helpers.EXPECT_DOC(true, done, doc2.getId());
                });
            });
        });
        describe('document exists', function() {
            let doc;
            beforeEach(function(done) {
                Helpers.CREATE_DOC(model => { doc = model; done(); });
            });
            describe('document has not been changed', function() {
                it('readFixed', function(done) {
                    const oldRev = doc.getRev();
                    DocMeta.readFixed(doc, (err) => {
                        expect(err).to.be.undefined;
                        expect(doc.getRev()).to.equal(oldRev);
                        expect(doc._latestRev).to.equal(doc.getRev());
                        done();
                    });
                });
                it('read', function(done) {
                    DocMeta.read(Helpers.Model, doc.getId(), (err, doc2) => {
                        expect(err).to.be.undefined;
                        expect(doc2.getId()).to.equal(doc.getId());
                        expect(doc2.getRev()).to.equal(doc.getRev());
                        expect(doc2._latestRev).to.equal(doc.getRev());
                        Helpers.EXPECT_DOC_BODY(doc2.body, doc.body);
                        done();
                    });
                });
                it('headFixed', function(done) {
                    const oldRev = doc.getRev();
                    DocMeta.headFixed(doc, (err) => {
                        expect(err).to.be.undefined;
                        expect(doc.getRev()).to.equal(oldRev);
                        done();
                    });
                });
                it('head', function(done) {
                    DocMeta.head(Helpers.Model, doc.getId(), (err, rev) => {
                        expect(err).to.be.undefined;
                        expect(rev).to.equal(doc.getRev());
                        expect(rev).to.equal(doc._latestRev);
                        done();
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.getRev();
                    DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                        expect(err).to.be.undefined;
                        expect(doc.getRev()).to.not.equal(oldRev);
                        expect(doc._latestRev).to.equal(doc.getRev());
                        Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                        done();
                    });
                });
                it('write', function(done) {
                    DocMeta.write(Helpers.Model, doc.getId(), Helpers.data.doc2, (err, doc2) => {
                        expect(err).to.be.undefined;
                        expect(doc2.getId()).to.equal(doc.getId());
                        expect(doc2.getRev()).to.not.equal(doc.getRev());
                        expect(doc2._latestRev).to.equal(doc2.getRev());
                        Helpers.EXPECT_DOC_BODY(doc2.body, Helpers.data.doc2);
                        done();
                    });
                });
                it('updateFixed', function(done) {
                    const oldRev = doc.getRev();
                    DocMeta.updateFixed(doc, { race: 'dog' }, (err) => {
                        expect(err).to.be.undefined;
                        expect(doc.getRev()).to.not.equal(oldRev);
                        expect(doc._latestRev).to.equal(doc.getRev());
                        Helpers.EXPECT_DOC_BODY(doc.body, Object.assign({}, Helpers.data.doc, { race: 'dog' }));
                        done();
                    });
                });
                it('update', function(done) {
                    DocMeta.update(Helpers.Model, doc.getId(), { race: 'dog' }, (err, doc2) => {
                        expect(err).to.be.undefined;
                        expect(doc2.getId()).to.equal(doc.getId());
                        expect(doc2.getRev()).to.not.equal(doc.getRev());
                        expect(doc2._latestRev).to.equal(doc2.getRev());
                        Helpers.EXPECT_DOC_BODY(doc2.body, Object.assign({}, Helpers.data.doc, { race: 'dog' }));
                        done();
                    });
                });
                it('updateOrWrite', function(done) {
                    DocMeta.updateOrWrite(Helpers.Model, doc.getId(), { race: 'dog' }, (err, doc2) => {
                        expect(doc2.getId()).to.equal(doc.getId());
                        expect(doc2.getRev()).to.not.equal(doc.getRev());
                        expect(doc2._latestRev).to.equal(doc2.getRev());
                        Helpers.EXPECT_DOC_BODY(doc2.body, Object.assign({}, Helpers.data.doc, { race: 'dog' }));
                        done();
                    });
                });
            });
            describe('document changed', function() {
                let doc2;
                beforeEach(function(done) {
                    Helpers.CHANGE_DOC(doc, model => { doc2 = model; done(); });
                });
                it('readFixed', function(done) {
                    DocMeta.readFixed(doc, (err) => {
                        expect(err).to.be.undefined;
                        expect(doc.getId()).to.equal(doc2.getId());
                        expect(doc.getRev()).to.equal(doc2.getRev());
                        expect(doc._latestRev).to.equal(doc.getRev());
                        expect(doc.body.race).to.equal(doc2.body.race);
                        done();
                    });
                });
                it('read', function(done) {
                    DocMeta.read(Helpers.Model, doc.getId(), (err, doc3) => {
                        expect(err).to.be.undefined;
                        expect(doc3.getId()).to.equal(doc2.getId());
                        expect(doc3.getRev()).to.equal(doc2.getRev());
                        expect(doc3._latestRev).to.equal(doc3.getRev());
                        expect(doc3.body.race).to.equal(doc2.body.race);
                        done();
                    });
                });
                it('headFixed', function(done) {
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
                it('head', function(done) {
                    DocMeta.head(Helpers.Model, doc.getId(), (err, rev) => {
                        expect(err).to.be.undefined;
                        expect(rev).to.equal(doc2.getRev());
                        expect(rev).to.equal(doc2._latestRev);
                        done();
                    });
                });
                it('writeFixed', function(done) {
                    DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                        expect(err).to.be.undefined;
                        expect(doc.getId()).to.equal(doc2.getId());
                        expect(doc.getRev()).to.not.equal(doc2.getRev());
                        expect(doc._latestRev).to.equal(doc.getRev());
                        Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                        done();
                    });
                });
                it('write', function(done) {
                    DocMeta.write(Helpers.Model, doc.getId(), Helpers.data.doc2, (err, doc2) => {
                        expect(err).to.be.undefined;
                        expect(doc2.getRev()).to.not.equal(doc.getRev());
                        expect(doc2._latestRev).to.equal(doc2.getRev());
                        Helpers.EXPECT_DOC_BODY(doc2.body, Helpers.data.doc2);
                        done();
                    });
                });
                it('updateFixed', function(done) {
                    DocMeta.updateFixed(doc, { race: 'dog' }, (err) => {
                        expect(err).to.be.undefined;
                        expect(doc.getRev()).to.not.equal(doc2.getRev());
                        expect(doc._latestRev).to.equal(doc.getRev());
                        Helpers.EXPECT_DOC_BODY(doc.body, Object.assign({}, Helpers.data.doc, { race: 'dog' }));
                        done();
                    });
                });
                it('update', function(done) {
                    DocMeta.update(Helpers.Model, doc.getId(), { race: 'dog' }, (err, doc2) => {
                        expect(err).to.be.undefined;
                        expect(doc2.getId()).to.equal(doc.getId());
                        expect(doc2.getRev()).to.not.equal(doc.getRev());
                        expect(doc2._latestRev).to.equal(doc2.getRev());
                        Helpers.EXPECT_DOC_BODY(doc2.body, Object.assign({}, Helpers.data.doc, { race: 'dog' }));
                        done();
                    });
                });
                it('updateOrWrite', function(done) {
                    DocMeta.updateOrWrite(Helpers.Model, doc.getId(), { race: 'dog' }, (err, doc2) => {
                        expect(doc2.getId()).to.equal(doc.getId());
                        expect(doc2.getRev()).to.not.equal(doc.getRev());
                        expect(doc2._latestRev).to.equal(doc2.getRev());
                        Helpers.EXPECT_DOC_BODY(doc2.body, Object.assign({}, Helpers.data.doc, { race: 'dog' }));
                        done();
                    });
                });
            });
        });
    });
});
