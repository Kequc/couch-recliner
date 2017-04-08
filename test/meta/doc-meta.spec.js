'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const DocMeta = require('../../lib/meta/doc-meta');
const Helpers = require('../Helpers');

describe('DocMeta', function() {
    beforeEach(Helpers.DESTROY_DB);
    describe('database does not exist', function() {
        it('readFixed', function(done) {
            const doc = Helpers.GENERATE_FAKE_DOC();
            DocMeta.readFixed(doc, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_DOC_DOES_NOT_EXIST(doc.id, done);
            });
        });
        it('read', function(done) {
            DocMeta.read(Helpers.Model, Helpers.data.id, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_DOC_DOES_NOT_EXIST(Helpers.data.id, done);
            });
        });
        it('headFixed', function(done) {
            const doc = Helpers.GENERATE_FAKE_DOC();
            DocMeta.headFixed(doc, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_DOC_DOES_NOT_EXIST(doc.id, done);
            });
        });
        it('head', function(done) {
            DocMeta.head(Helpers.Model, Helpers.data.id, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_DOC_DOES_NOT_EXIST(Helpers.data.id, done);
            });
        });
        it('writeFixed', function(done) {
            const doc = Helpers.GENERATE_FAKE_DOC();
            const oldRev = doc.rev;
            DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                Helpers.EXPECT_NO_ERROR(err);
                Helpers.EXPECT_REV_CHANGED(doc, oldRev);
                Helpers.EXPECT_LATEST_REV(doc);
                Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, Helpers.data.doc2, done);
            });
        });
        it('write', function(done) {
            DocMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.doc2, (err, doc) => {
                Helpers.EXPECT_NO_ERROR(err);
                Helpers.EXPECT_LATEST_REV(doc);
                Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                Helpers.EXPECT_DOC_EXISTS_WITH_BODY(Helpers.data.id, Helpers.data.doc2, done);
            });
        });
        it('updateFixed', function(done) {
            const doc = Helpers.GENERATE_FAKE_DOC();
            const oldRev = doc.rev;
            DocMeta.updateFixed(doc, Helpers.data.update2, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_REV(doc, oldRev);
                Helpers.EXPECT_LATEST_REV(doc);
                Helpers.EXPECT_DOC_DOES_NOT_EXIST(doc.id, done);
            });
        });
        it('update', function(done) {
            DocMeta.update(Helpers.Model, Helpers.data.id, Helpers.data.update2, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_DOC_DOES_NOT_EXIST(Helpers.data.id, done);
            });
        });
        it('updateOrWrite', function(done) {
            DocMeta.updateOrWrite(Helpers.Model, Helpers.data.id, Helpers.data.doc2, (err, doc) => {
                Helpers.EXPECT_NO_ERROR(err);
                Helpers.EXPECT_LATEST_REV(doc);
                Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                Helpers.EXPECT_DOC_EXISTS_WITH_BODY(Helpers.data.id, Helpers.data.doc2, done);
            });
        });
        it('create', function(done) {
            DocMeta.create(Helpers.Model, Helpers.data.doc2, (err, doc) => {
                Helpers.EXPECT_NO_ERROR(err);
                Helpers.EXPECT_LATEST_REV(doc);
                Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, Helpers.data.doc2, done);
            });
        });
        it('destroyFixed', function(done) {
            const doc = Helpers.GENERATE_FAKE_DOC();
            DocMeta.destroyFixed(doc, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_DOC_DOES_NOT_EXIST(doc.id, done);
            });
        });
        it('destroy', function(done) {
            DocMeta.destroy(Helpers.Model, Helpers.data.id, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_DOC_DOES_NOT_EXIST(Helpers.data.id, done);
            });
        });
    });
    describe('database exists', function() {
        beforeEach(Helpers.CREATE_DB);
        describe('document does not exist', function() {
            it('readFixed', function(done) {
                DocMeta.readFixed(Helpers.GENERATE_FAKE_DOC(), (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_DOC_DOES_NOT_EXIST(Helpers.data.id, done);
                });
            });
            it('read', function(done) {
                DocMeta.read(Helpers.Model, Helpers.data.id, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_DOC_DOES_NOT_EXIST(Helpers.data.id, done);
                });
            });
            it('headFixed', function(done) {
                const doc = Helpers.GENERATE_FAKE_DOC();
                DocMeta.headFixed(doc, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_DOC_DOES_NOT_EXIST(doc.id, done);
                });
            });
            it('head', function(done) {
                DocMeta.head(Helpers.Model, Helpers.data.id, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_DOC_DOES_NOT_EXIST(Helpers.data.id, done);
                });
            });
            it('writeFixed', function(done) {
                const doc = Helpers.GENERATE_FAKE_DOC();
                const oldRev = doc.rev;
                DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_REV_CHANGED(doc, oldRev);
                    Helpers.EXPECT_LATEST_REV(doc);
                    Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, Helpers.data.doc2, done);
                });
            });
            it('write', function(done) {
                DocMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.doc2, (err, doc) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_LATEST_REV(doc);
                    Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(Helpers.data.id, Helpers.data.doc2, done);
                });
            });
            it('updateFixed', function(done) {
                const doc = Helpers.GENERATE_FAKE_DOC();
                const oldRev = doc.rev;
                DocMeta.updateFixed(doc, Helpers.data.update2, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_REV(doc, oldRev);
                    Helpers.EXPECT_LATEST_REV(doc);
                    Helpers.EXPECT_DOC_DOES_NOT_EXIST(doc.id, done);
                });
            });
            it('update', function(done) {
                DocMeta.update(Helpers.Model, Helpers.data.id, Helpers.data.update2, (err, doc2) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_DOC_DOES_NOT_EXIST(Helpers.data.id, done);
                });
            });
            it('updateOrWrite', function(done) {
                DocMeta.updateOrWrite(Helpers.Model, Helpers.data.id, Helpers.data.doc2, (err, doc) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_LATEST_REV(doc);
                    Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(Helpers.data.id, Helpers.data.doc2, done);
                });
            });
            it('create', function(done) {
                DocMeta.create(Helpers.Model, Helpers.data.doc2, (err, doc) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_LATEST_REV(doc);
                    Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, Helpers.data.doc2, done);
                });
            });
            it('destroyFixed', function(done) {
                const doc = Helpers.GENERATE_FAKE_DOC();
                const oldId = doc.id;
                DocMeta.destroyFixed(doc, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_DOC_DOES_NOT_EXIST(oldId, done)
                });
            });
            it('destroy', function(done) {
                DocMeta.destroy(Helpers.Model, Helpers.data.id, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_DOC_DOES_NOT_EXIST(Helpers.data.id, done);
                });
            });
        });
        describe('attachment does not exist', function() {
            let doc;
            beforeEach(function(done) {
                Helpers.CREATE_DOC(model => { doc = model; done(); });
            });
            describe('document has not been changed', function() {
                it('readFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body);
                    DocMeta.readFixed(doc, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('read', function(done) {
                    DocMeta.read(Helpers.Model, doc.id, (err, doc2) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.rev);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_DOC_BODY(doc2.body, doc.body);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, doc.body, done);
                    });
                });
                it('headFixed', function(done) {
                    const expected = Object.assign({}, doc.body);
                    DocMeta.headFixed(doc, (err, rev) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, rev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('head', function(done) {
                    DocMeta.head(Helpers.Model, doc.id, (err, rev) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, rev);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, doc.body, done);
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.rev;
                    DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV_CHANGED(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, Helpers.data.doc2, done);
                    });
                });
                it('write', function(done) {
                    DocMeta.write(Helpers.Model, doc.id, Helpers.data.doc2, (err, doc2) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV_CHANGED(doc2, doc.rev);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_DOC_BODY(doc2.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, Helpers.data.doc2, done);
                    });
                });
                it('updateFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body, Helpers.data.update2);
                    DocMeta.updateFixed(doc, Helpers.data.update2, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV_CHANGED(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('update', function(done) {
                    const expected = Object.assign({}, doc.body, Helpers.data.update2);
                    DocMeta.update(Helpers.Model, doc.id, Helpers.data.update2, (err, doc2) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV_CHANGED(doc2, doc.rev);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('updateOrWrite', function(done) {
                    const expected = Object.assign({}, doc.body, Helpers.data.update2);
                    DocMeta.updateOrWrite(Helpers.Model, doc.id, Helpers.data.update2, (err, doc2) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV_CHANGED(doc2, doc.rev);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('destroyFixed', function(done) {
                    const oldId = doc.id;
                    DocMeta.destroyFixed(doc, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        expect(doc.id).to.be.undefined;
                        expect(doc.rev).to.be.undefined;
                        expect(doc._latestRev).to.be.undefined;
                        Helpers.EXPECT_DOC_BODY(doc.body, {});
                        Helpers.EXPECT_DOC_DOES_NOT_EXIST(oldId, done);
                    });
                });
                it('destroy', function(done) {
                    DocMeta.destroy(Helpers.Model, doc.id, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_DOC_DOES_NOT_EXIST(doc.id, done);
                    });
                });
            });
            describe('document changed', function() {
                let doc2;
                beforeEach(function(done) {
                    Helpers.CHANGE_DOC_IN_BACKGROUND(doc, model => { doc2 = model; done(); });
                });
                it('readFixed', function(done) {
                    DocMeta.readFixed(doc, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, doc2.rev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, doc2.body);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, doc2.body, done);
                    });
                });
                it('read', function(done) {
                    DocMeta.read(Helpers.Model, doc.id, (err, doc3) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc3, doc2);
                        Helpers.EXPECT_REV(doc3, doc2.rev);
                        Helpers.EXPECT_LATEST_REV(doc3);
                        Helpers.EXPECT_DOC_BODY(doc3.body, doc2.body);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, doc2.body, done);
                    });
                });
                it('headFixed', function(done) {
                    const expected = Object.assign({}, doc.body);
                    DocMeta.headFixed(doc, (err, rev) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc2, rev);
                        Helpers.EXPECT_REV_CHANGED(doc, rev);
                        Helpers.EXPECT_LATEST_REV(doc, rev);
                        Helpers.EXPECT_LATEST_REV_CHANGED(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, doc2.body, done);
                    });
                });
                it('head', function(done) {
                    DocMeta.head(Helpers.Model, doc.id, (err, rev) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc2, rev);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, doc2.body, done);
                    });
                });
                it('writeFixed', function(done) {
                    DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV_CHANGED(doc, doc2.rev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, Helpers.data.doc2, done);
                    });
                });
                it('write', function(done) {
                    DocMeta.write(Helpers.Model, doc.id, Helpers.data.doc2, (err, doc3) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc3, doc2);
                        Helpers.EXPECT_REV_CHANGED(doc3, doc2.rev);
                        Helpers.EXPECT_LATEST_REV(doc3);
                        Helpers.EXPECT_DOC_BODY(doc3.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, Helpers.data.doc2, done);
                    });
                });
                it('updateFixed', function(done) {
                    const expected = Object.assign({}, doc2.body, Helpers.data.update2);
                    DocMeta.updateFixed(doc, Helpers.data.update2, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV_CHANGED(doc, doc2.rev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('update', function(done) {
                    const expected = Object.assign({}, doc2.body, Helpers.data.update2);
                    DocMeta.update(Helpers.Model, doc.id, Helpers.data.update2, (err, doc3) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc3, doc2);
                        Helpers.EXPECT_REV_CHANGED(doc3, doc2.rev);
                        Helpers.EXPECT_LATEST_REV(doc3);
                        Helpers.EXPECT_DOC_BODY(doc3.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('updateOrWrite', function(done) {
                    const expected = Object.assign({}, doc2.body, Helpers.data.update2);
                    DocMeta.updateOrWrite(Helpers.Model, doc.id, Helpers.data.update2, (err, doc3) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc3, doc2);
                        Helpers.EXPECT_REV_CHANGED(doc3, doc2.rev);
                        Helpers.EXPECT_LATEST_REV(doc3);
                        Helpers.EXPECT_DOC_BODY(doc3.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('destroyFixed', function(done) {
                    DocMeta.destroyFixed(doc, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        expect(doc.id).to.be.undefined;
                        expect(doc.rev).to.be.undefined;
                        expect(doc._latestRev).to.be.undefined;
                        Helpers.EXPECT_DOC_BODY(doc.body, {});
                        Helpers.EXPECT_DOC_DOES_NOT_EXIST(doc2.id, done);
                    });
                });
                it('destroy', function(done) {
                    DocMeta.destroy(Helpers.Model, doc.id, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_DOC_DOES_NOT_EXIST(doc.id, done);
                    });
                });
            });
        });
        describe('attachment exists', function() {
            let doc;
            beforeEach(function(done) {
                Helpers.CREATE_DOC_WITH_ATTACHMENT(model => { doc = model; done(); });
            });
            describe('document has not been changed', function() {
                it('readFixed', function(done) {
                    const expected = Object.assign({}, doc.body);
                    DocMeta.readFixed(doc, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, expected._rev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('read', function(done) {
                    DocMeta.read(Helpers.Model, doc.id, (err, doc2) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.rev);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_DOC_BODY(doc2.body, doc.body);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, doc.body, done);
                    });
                });
                it('headFixed', function(done) {
                    const expected = Object.assign({}, doc.body);
                    DocMeta.headFixed(doc, (err, rev) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, rev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('head', function(done) {
                    DocMeta.head(Helpers.Model, doc.id, (err, rev) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, rev);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, doc.body, done);
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.rev;
                    DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV_CHANGED(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, Helpers.data.doc2, done);
                    });
                });
                it('write', function(done) {
                    DocMeta.write(Helpers.Model, doc.id, Helpers.data.doc2, (err, doc2) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV_CHANGED(doc2, doc.rev);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_DOC_BODY(doc2.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, Helpers.data.doc2, done);
                    });
                });
                it('updateFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body, Helpers.data.update2);
                    DocMeta.updateFixed(doc, Helpers.data.update2, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV_CHANGED(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('update', function(done) {
                    const expected = Object.assign({}, doc.body, Helpers.data.update2);
                    DocMeta.update(Helpers.Model, doc.id, Helpers.data.update2, (err, doc2) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV_CHANGED(doc2, doc.rev);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('updateOrWrite', function(done) {
                    const expected = Object.assign({}, doc.body, Helpers.data.update2);
                    DocMeta.updateOrWrite(Helpers.Model, doc.id, Helpers.data.update2, (err, doc2) => {
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV_CHANGED(doc2, doc.rev);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('destroyFixed', function(done) {
                    const oldId = doc.id;
                    DocMeta.destroyFixed(doc, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        expect(doc.id).to.be.undefined;
                        expect(doc.rev).to.be.undefined;
                        expect(doc._latestRev).to.be.undefined;
                        Helpers.EXPECT_DOC_BODY(doc.body, {});
                        Helpers.EXPECT_DOC_DOES_NOT_EXIST(oldId, done);
                    });
                });
                it('destroy', function(done) {
                    DocMeta.destroy(Helpers.Model, doc.id, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_DOC_DOES_NOT_EXIST(doc.id, done);
                    });
                });
            });
            describe('document changed', function() {
                let doc2;
                beforeEach(function(done) {
                    Helpers.CHANGE_DOC_IN_BACKGROUND(doc, model => { doc2 = model; done(); });
                });
                it('readFixed', function(done) {
                    DocMeta.readFixed(doc, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, doc2.rev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, doc2.body);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, doc2.body, done);
                    });
                });
                it('read', function(done) {
                    DocMeta.read(Helpers.Model, doc.id, (err, doc3) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc3, doc2);
                        Helpers.EXPECT_REV(doc3, doc2.rev);
                        Helpers.EXPECT_LATEST_REV(doc3);
                        Helpers.EXPECT_DOC_BODY(doc3.body, doc2.body);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, doc2.body, done);
                    });
                });
                it('headFixed', function(done) {
                    const expected = Object.assign({}, doc.body);
                    DocMeta.headFixed(doc, (err, rev) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc2, rev);
                        Helpers.EXPECT_REV_CHANGED(doc, rev);
                        Helpers.EXPECT_LATEST_REV(doc, rev);
                        Helpers.EXPECT_DOC_BODY(doc.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, doc2.body, done);
                    });
                });
                it('head', function(done) {
                    DocMeta.head(Helpers.Model, doc.id, (err, rev) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc2, rev);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, doc2.body, done);
                    });
                });
                it('writeFixed', function(done) {
                    DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV_CHANGED(doc, doc2.rev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, Helpers.data.doc2, done);
                    });
                });
                it('write', function(done) {
                    DocMeta.write(Helpers.Model, doc.id, Helpers.data.doc2, (err, doc3) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc3, doc2);
                        Helpers.EXPECT_REV_CHANGED(doc3, doc2.rev);
                        Helpers.EXPECT_LATEST_REV(doc3);
                        Helpers.EXPECT_DOC_BODY(doc3.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, Helpers.data.doc2, done);
                    });
                });
                it('updateFixed', function(done) {
                    const expected = Object.assign({}, doc2.body, Helpers.data.update2);
                    DocMeta.updateFixed(doc, Helpers.data.update2, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV_CHANGED(doc, doc2.rev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('update', function(done) {
                    const expected = Object.assign({}, doc2.body, Helpers.data.update2);
                    DocMeta.update(Helpers.Model, doc.id, Helpers.data.update2, (err, doc3) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc3, doc2);
                        Helpers.EXPECT_REV_CHANGED(doc3, doc2.rev);
                        Helpers.EXPECT_LATEST_REV(doc3);
                        Helpers.EXPECT_DOC_BODY(doc3.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('updateOrWrite', function(done) {
                    const expected = Object.assign({}, doc2.body, Helpers.data.update2);
                    DocMeta.updateOrWrite(Helpers.Model, doc.id, Helpers.data.update2, (err, doc3) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc3, doc2);
                        Helpers.EXPECT_REV_CHANGED(doc3, doc2.rev);
                        Helpers.EXPECT_LATEST_REV(doc3);
                        Helpers.EXPECT_DOC_BODY(doc3.body, expected);
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, done);
                    });
                });
                it('destroyFixed', function(done) {
                    const oldId = doc.id;
                    DocMeta.destroyFixed(doc, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        expect(doc.id).to.be.undefined;
                        expect(doc.rev).to.be.undefined;
                        expect(doc._latestRev).to.be.undefined;
                        Helpers.EXPECT_DOC_BODY(doc.body, {});
                        Helpers.EXPECT_DOC_DOES_NOT_EXIST(oldId, done);
                    });
                });
                it('destroy', function(done) {
                    DocMeta.destroy(Helpers.Model, doc.id, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_DOC_DOES_NOT_EXIST(doc.id, done);
                    });
                });
            });
        });
    });
});
