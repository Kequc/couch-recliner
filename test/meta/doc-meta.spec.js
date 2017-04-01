'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const DocMeta = require('../../lib/meta/doc-meta');
const Helpers = require('../Helpers');

describe('DocMeta', function() {
    beforeEach(Helpers.DESTROY_DB);
    describe('database does not exist', function() {
        it('readFixed', function(done) {
            const doc = Helpers.GENERATE_DOC();
            DocMeta.readFixed(doc, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_DOC(false, done, doc.getId());
            });
        });
        it('read', function(done) {
            DocMeta.read(Helpers.Model, Helpers.data.id, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_DOC(false, done);
            });
        });
        it('headFixed', function(done) {
            const doc = Helpers.GENERATE_DOC();
            DocMeta.headFixed(doc, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_DOC(false, done, doc.getId());
            });
        });
        it('head', function(done) {
            DocMeta.head(Helpers.Model, Helpers.data.id, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_DOC(false, done);
            });
        });
        it('writeFixed', function(done) {
            const doc = Helpers.GENERATE_DOC();
            const oldRev = doc.getRev();
            DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                Helpers.EXPECT_ERROR(err);
                Helpers.EXPECT_REV(doc, oldRev, true);
                Helpers.EXPECT_LATEST_REV(doc);
                Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                Helpers.EXPECT_DOC(Helpers.data.doc2, done, doc.getId());
            });
        });
        it('write', function(done) {
            DocMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.doc2, (err, doc) => {
                Helpers.EXPECT_ERROR(err);
                Helpers.EXPECT_LATEST_REV(doc);
                Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                Helpers.EXPECT_DOC(Helpers.data.doc2, done);
            });
        });
        it('updateFixed', function(done) {
            const doc = Helpers.GENERATE_DOC();
            const oldRev = doc.getRev();
            DocMeta.updateFixed(doc, { race: 'dog' }, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_REV(doc, oldRev);
                Helpers.EXPECT_LATEST_REV(doc);
                Helpers.EXPECT_DOC(false, done, doc.getId());
            });
        });
        it('update', function(done) {
            DocMeta.update(Helpers.Model, Helpers.data.id, { race: 'dog' }, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_DOC(false, done);
            });
        });
        it('updateOrWrite', function(done) {
            DocMeta.updateOrWrite(Helpers.Model, Helpers.data.id, Helpers.data.doc2, (err, doc) => {
                Helpers.EXPECT_ERROR(err);
                Helpers.EXPECT_LATEST_REV(doc);
                Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                Helpers.EXPECT_DOC(Helpers.data.doc2, done);
            });
        });
        it('create', function(done) {
            DocMeta.create(Helpers.Model, Helpers.data.doc2, (err, doc) => {
                Helpers.EXPECT_ERROR(err);
                Helpers.EXPECT_LATEST_REV(doc);
                Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                Helpers.EXPECT_DOC(Helpers.data.doc2, done, doc.getId());
            });
        });
        it('destroyFixed', function(done) {
            const doc = Helpers.GENERATE_DOC();
            DocMeta.destroyFixed(doc, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_DOC(false, done, doc.getId());
            });
        });
        it('destroy', function(done) {
            DocMeta.destroy(Helpers.Model, Helpers.data.id, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_DOC(false, done);
            });
        });
    });
    describe('database exists', function() {
        beforeEach(Helpers.CREATE_DB);
        describe('document does not exist', function() {
            it('readFixed', function(done) {
                DocMeta.readFixed(Helpers.GENERATE_DOC(), (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_DOC(false, done);
                });
            });
            it('read', function(done) {
                DocMeta.read(Helpers.Model, Helpers.data.id, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_DOC(false, done);
                });
            });
            it('headFixed', function(done) {
                const doc = Helpers.GENERATE_DOC();
                DocMeta.headFixed(doc, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_DOC(false, done, doc.getId());
                });
            });
            it('head', function(done) {
                DocMeta.head(Helpers.Model, Helpers.data.id, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_DOC(false, done);
                });
            });
            it('writeFixed', function(done) {
                const doc = Helpers.GENERATE_DOC();
                const oldRev = doc.getRev();
                DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                    Helpers.EXPECT_ERROR(err);
                    Helpers.EXPECT_REV(doc, oldRev, true);
                    Helpers.EXPECT_LATEST_REV(doc);
                    Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                    Helpers.EXPECT_DOC(Helpers.data.doc2, done, doc.getId());
                });
            });
            it('write', function(done) {
                DocMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.doc2, (err, doc) => {
                    Helpers.EXPECT_ERROR(err);
                    Helpers.EXPECT_LATEST_REV(doc);
                    Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                    Helpers.EXPECT_DOC(Helpers.data.doc2, done);
                });
            });
            it('updateFixed', function(done) {
                const doc = Helpers.GENERATE_DOC();
                const oldRev = doc.getRev();
                DocMeta.updateFixed(doc, { race: 'dog' }, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_REV(doc, oldRev);
                    Helpers.EXPECT_LATEST_REV(doc);
                    Helpers.EXPECT_DOC(false, done, doc.getId());
                });
            });
            it('update', function(done) {
                DocMeta.update(Helpers.Model, Helpers.data.id, { race: 'dog' }, (err, doc2) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_DOC(false, done);
                });
            });
            it('updateOrWrite', function(done) {
                DocMeta.updateOrWrite(Helpers.Model, Helpers.data.id, Helpers.data.doc2, (err, doc) => {
                    Helpers.EXPECT_ERROR(err);
                    Helpers.EXPECT_LATEST_REV(doc);
                    Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                    Helpers.EXPECT_DOC(Helpers.data.doc2, done);
                });
            });
            it('create', function(done) {
                DocMeta.create(Helpers.Model, Helpers.data.doc2, (err, doc) => {
                    Helpers.EXPECT_ERROR(err);
                    Helpers.EXPECT_LATEST_REV(doc);
                    Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                    Helpers.EXPECT_DOC(Helpers.data.doc2, done, doc.getId());
                });
            });
            it('destroyFixed', function(done) {
                const doc = Helpers.GENERATE_DOC();
                const oldId = doc.getId();
                DocMeta.destroyFixed(doc, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_DOC(false, done, oldId)
                });
            });
            it('destroy', function(done) {
                DocMeta.destroy(Helpers.Model, Helpers.data.id, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_DOC(false, done);
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
                    const oldRev = doc.getRev();
                    const oldBody = Object.assign({}, doc.body);
                    DocMeta.readFixed(doc, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, oldBody);
                        Helpers.EXPECT_DOC(oldBody, done, doc.getId());
                    });
                });
                it('read', function(done) {
                    DocMeta.read(Helpers.Model, doc.getId(), (err, doc2) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.getRev());
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_DOC_BODY(doc2.body, doc.body);
                        Helpers.EXPECT_DOC(doc.body, done, doc2.getId());
                    });
                });
                it('headFixed', function(done) {
                    const oldBody = Object.assign({}, doc.body);
                    DocMeta.headFixed(doc, (err, rev) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, rev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, oldBody);
                        Helpers.EXPECT_DOC(oldBody, done, doc.getId());
                    });
                });
                it('head', function(done) {
                    DocMeta.head(Helpers.Model, doc.getId(), (err, rev) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, rev);
                        Helpers.EXPECT_DOC(doc.body, done, doc.getId());
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.getRev();
                    DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev, true);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC(Helpers.data.doc2, done, doc.getId());
                    });
                });
                it('write', function(done) {
                    DocMeta.write(Helpers.Model, doc.getId(), Helpers.data.doc2, (err, doc2) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_DOC_BODY(doc2.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC(Helpers.data.doc2, done, doc.getId());
                    });
                });
                it('updateFixed', function(done) {
                    const oldRev = doc.getRev();
                    const oldBody = Object.assign({}, doc.body);
                    DocMeta.updateFixed(doc, { race: 'dog' }, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev, true);
                        Helpers.EXPECT_LATEST_REV(doc);
                        const expected = Object.assign({}, oldBody, { race: 'dog' });
                        Helpers.EXPECT_DOC_BODY(doc.body, expected);
                        Helpers.EXPECT_DOC(expected, done, doc.getId());
                    });
                });
                it('update', function(done) {
                    DocMeta.update(Helpers.Model, doc.getId(), { race: 'dog' }, (err, doc2) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        const expected = Object.assign({}, doc.body, { race: 'dog' });
                        Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                        Helpers.EXPECT_DOC(expected, done, doc.getId());
                    });
                });
                it('updateOrWrite', function(done) {
                    const oldBody = Object.assign({}, doc.body);
                    DocMeta.updateOrWrite(Helpers.Model, doc.getId(), { race: 'dog' }, (err, doc2) => {
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        const expected = Object.assign({}, oldBody, { race: 'dog' });
                        Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                        Helpers.EXPECT_DOC(expected, done, doc.getId());
                    });
                });
                it('destroyFixed', function(done) {
                    const oldId = doc.getId();
                    DocMeta.destroyFixed(doc, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        expect(doc.getId()).to.be.undefined;
                        expect(doc.getRev()).to.be.undefined;
                        expect(doc._latestRev).to.be.undefined;
                        Helpers.EXPECT_DOC_BODY(doc.body, {});
                        Helpers.EXPECT_DOC(false, done, oldId);
                    });
                });
                it('destroy', function(done) {
                    DocMeta.destroy(Helpers.Model, Helpers.data.id, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_DOC(false, done);
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
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, doc2.getRev());
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, doc2.body);
                        Helpers.EXPECT_DOC(doc2.body, done, doc.getId());
                    });
                });
                it('read', function(done) {
                    DocMeta.read(Helpers.Model, doc.getId(), (err, doc3) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc3, doc2);
                        Helpers.EXPECT_REV(doc3, doc2.getRev());
                        Helpers.EXPECT_LATEST_REV(doc3);
                        Helpers.EXPECT_DOC_BODY(doc3.body, doc2.body);
                        Helpers.EXPECT_DOC(doc2.body, done, doc.getId());
                    });
                });
                it('headFixed', function(done) {
                    const oldBody = Object.assign({}, doc.body);
                    DocMeta.headFixed(doc, (err, rev) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc2, rev);
                        Helpers.EXPECT_REV(doc, rev, true);
                        Helpers.EXPECT_LATEST_REV(doc, rev);
                        Helpers.EXPECT_DOC_BODY(doc.body, oldBody);
                        Helpers.EXPECT_DOC(doc2.body, done, doc.getId());
                    });
                });
                it('head', function(done) {
                    DocMeta.head(Helpers.Model, doc.getId(), (err, rev) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc2, rev);
                        Helpers.EXPECT_LATEST_REV(doc2, rev);
                        Helpers.EXPECT_DOC(doc2.body, done, doc.getId());
                    });
                });
                it('writeFixed', function(done) {
                    DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, doc2.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC(Helpers.data.doc2, done, doc.getId());
                    });
                });
                it('write', function(done) {
                    DocMeta.write(Helpers.Model, doc.getId(), Helpers.data.doc2, (err, doc2) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_DOC_BODY(doc2.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC(Helpers.data.doc2, done, doc.getId());
                    });
                });
                it('updateFixed', function(done) {
                    const oldBody = Object.assign({}, doc.body);
                    DocMeta.updateFixed(doc, { race: 'dog' }, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, doc2.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc);
                        const expected = Object.assign({}, oldBody, { race: 'dog' });
                        Helpers.EXPECT_DOC_BODY(doc.body, expected);
                        Helpers.EXPECT_DOC(expected, done, doc.getId());
                    });
                });
                it('update', function(done) {
                    DocMeta.update(Helpers.Model, doc.getId(), { race: 'dog' }, (err, doc2) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        const expected = Object.assign({}, doc.body, { race: 'dog' });
                        Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                        Helpers.EXPECT_DOC(expected, done, doc.getId());
                    });
                });
                it('updateOrWrite', function(done) {
                    DocMeta.updateOrWrite(Helpers.Model, doc.getId(), { race: 'dog' }, (err, doc2) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        const expected = Object.assign({}, doc.body, { race: 'dog' });
                        Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                        Helpers.EXPECT_DOC(expected, done, doc.getId());
                    });
                });
                it('destroyFixed', function(done) {
                    const oldId = doc.getId();
                    DocMeta.destroyFixed(doc, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        expect(doc.getId()).to.be.undefined;
                        expect(doc.getRev()).to.be.undefined;
                        expect(doc._latestRev).to.be.undefined;
                        Helpers.EXPECT_DOC_BODY(doc.body, {});
                        Helpers.EXPECT_DOC(false, done, oldId);
                    });
                });
                it('destroy', function(done) {
                    DocMeta.destroy(Helpers.Model, Helpers.data.id, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_DOC(false, done);
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
                    const oldRev = doc.getRev();
                    const oldBody = Object.assign({}, doc.body);
                    DocMeta.readFixed(doc, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, oldBody);
                        Helpers.EXPECT_DOC(oldBody, done, doc.getId());
                    });
                });
                it('read', function(done) {
                    DocMeta.read(Helpers.Model, doc.getId(), (err, doc2) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.getRev());
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc2);
                        Helpers.EXPECT_DOC_BODY(doc2.body, doc.body);
                        Helpers.EXPECT_DOC(doc.body, done, doc2.getId());
                    });
                });
                it('headFixed', function(done) {
                    const oldBody = Object.assign({}, doc.body);
                    DocMeta.headFixed(doc, (err, rev) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, rev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, oldBody);
                        Helpers.EXPECT_DOC(oldBody, done, doc.getId());
                    });
                });
                it('head', function(done) {
                    DocMeta.head(Helpers.Model, doc.getId(), (err, rev) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, rev);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc);
                        Helpers.EXPECT_DOC(doc.body, done, doc.getId());
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.getRev();
                    DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev, true);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc, false);
                        Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC(Helpers.data.doc2, done, doc.getId());
                    });
                });
                it('write', function(done) {
                    DocMeta.write(Helpers.Model, doc.getId(), Helpers.data.doc2, (err, doc2) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc2, false);
                        Helpers.EXPECT_DOC_BODY(doc2.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC(Helpers.data.doc2, done, doc.getId());
                    });
                });
                it('updateFixed', function(done) {
                    const oldRev = doc.getRev();
                    const oldBody = Object.assign({}, doc.body);
                    DocMeta.updateFixed(doc, { race: 'dog' }, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev, true);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc);
                        const expected = Object.assign({}, oldBody, { race: 'dog' });
                        Helpers.EXPECT_DOC_BODY(doc.body, expected);
                        Helpers.EXPECT_DOC(expected, done, doc.getId());
                    });
                });
                it('update', function(done) {
                    DocMeta.update(Helpers.Model, doc.getId(), { race: 'dog' }, (err, doc2) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc2);
                        const expected = Object.assign({}, doc.body, { race: 'dog' });
                        Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                        Helpers.EXPECT_DOC(expected, done, doc.getId());
                    });
                });
                it('updateOrWrite', function(done) {
                    const oldBody = Object.assign({}, doc.body);
                    DocMeta.updateOrWrite(Helpers.Model, doc.getId(), { race: 'dog' }, (err, doc2) => {
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc2);
                        const expected = Object.assign({}, oldBody, { race: 'dog' });
                        Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                        Helpers.EXPECT_DOC(expected, done, doc.getId());
                    });
                });
                it('destroyFixed', function(done) {
                    const oldId = doc.getId();
                    DocMeta.destroyFixed(doc, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        expect(doc.getId()).to.be.undefined;
                        expect(doc.getRev()).to.be.undefined;
                        expect(doc._latestRev).to.be.undefined;
                        Helpers.EXPECT_ATTACHMENT_STUB(doc, false);
                        Helpers.EXPECT_DOC_BODY(doc.body, {});
                        Helpers.EXPECT_DOC(false, done, oldId);
                    });
                });
                it('destroy', function(done) {
                    DocMeta.destroy(Helpers.Model, Helpers.data.id, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_DOC(false, done);
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
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, doc2.getRev());
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, doc2.body);
                        Helpers.EXPECT_DOC(doc2.body, done, doc.getId());
                    });
                });
                it('read', function(done) {
                    DocMeta.read(Helpers.Model, doc.getId(), (err, doc3) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc3, doc2);
                        Helpers.EXPECT_REV(doc3, doc2.getRev());
                        Helpers.EXPECT_LATEST_REV(doc3);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc3);
                        Helpers.EXPECT_DOC_BODY(doc3.body, doc2.body);
                        Helpers.EXPECT_DOC(doc2.body, done, doc.getId());
                    });
                });
                it('headFixed', function(done) {
                    const oldBody = Object.assign({}, doc.body);
                    DocMeta.headFixed(doc, (err, rev) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc2, rev);
                        Helpers.EXPECT_REV(doc, rev, true);
                        Helpers.EXPECT_LATEST_REV(doc, rev);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc);
                        Helpers.EXPECT_DOC_BODY(doc.body, oldBody);
                        Helpers.EXPECT_DOC(doc2.body, done, doc.getId());
                    });
                });
                it('head', function(done) {
                    DocMeta.head(Helpers.Model, doc.getId(), (err, rev) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc2, rev);
                        Helpers.EXPECT_LATEST_REV(doc2, rev);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc2);
                        Helpers.EXPECT_DOC(doc2.body, done, doc.getId());
                    });
                });
                it('writeFixed', function(done) {
                    DocMeta.writeFixed(doc, Helpers.data.doc2, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, doc2.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc, false);
                        Helpers.EXPECT_DOC_BODY(doc.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC(Helpers.data.doc2, done, doc.getId());
                    });
                });
                it('write', function(done) {
                    DocMeta.write(Helpers.Model, doc.getId(), Helpers.data.doc2, (err, doc2) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc2, false);
                        Helpers.EXPECT_DOC_BODY(doc2.body, Helpers.data.doc2);
                        Helpers.EXPECT_DOC(Helpers.data.doc2, done, doc.getId());
                    });
                });
                it('updateFixed', function(done) {
                    const oldBody = Object.assign({}, doc.body);
                    DocMeta.updateFixed(doc, { race: 'dog' }, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, doc2.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc);
                        const expected = Object.assign({}, oldBody, { race: 'dog' });
                        Helpers.EXPECT_DOC_BODY(doc.body, expected);
                        Helpers.EXPECT_DOC(expected, done, doc.getId());
                    });
                });
                it('update', function(done) {
                    DocMeta.update(Helpers.Model, doc.getId(), { race: 'dog' }, (err, doc2) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc2);
                        const expected = Object.assign({}, doc.body, { race: 'dog' });
                        Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                        Helpers.EXPECT_DOC(expected, done, doc.getId());
                    });
                });
                it('updateOrWrite', function(done) {
                    DocMeta.updateOrWrite(Helpers.Model, doc.getId(), { race: 'dog' }, (err, doc2) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_SAME_DOC(doc2, doc);
                        Helpers.EXPECT_REV(doc2, doc.getRev(), true);
                        Helpers.EXPECT_LATEST_REV(doc2);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc2);
                        const expected = Object.assign({}, doc.body, { race: 'dog' });
                        Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                        Helpers.EXPECT_DOC(expected, done, doc.getId());
                    });
                });
                it('destroyFixed', function(done) {
                    const oldId = doc.getId();
                    DocMeta.destroyFixed(doc, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        expect(doc.getId()).to.be.undefined;
                        expect(doc.getRev()).to.be.undefined;
                        expect(doc._latestRev).to.be.undefined;
                        Helpers.EXPECT_ATTACHMENT_STUB(doc, false);
                        Helpers.EXPECT_DOC_BODY(doc.body, {});
                        Helpers.EXPECT_DOC(false, done, oldId);
                    });
                });
                it('destroy', function(done) {
                    DocMeta.destroy(Helpers.Model, Helpers.data.id, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_DOC(false, done);
                    });
                });
            });
        });
    });
});
