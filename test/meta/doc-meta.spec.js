'use strict';
const expect = require('chai').expect;

const DocMeta = require('../../lib/meta/doc-meta');
const Finder = require('../../lib/util/finder');

const BODY = require('../helpers/body-helpers');
const DATA = require('../helpers/data-helpers');
const DB = require('../helpers/db-helpers');
const DOC = require('../helpers/doc-helpers');
const ERR = require('../helpers/err-helpers');

describe('DocMeta', function() {
    beforeEach(DB.DESTROY);
    describe('database does not exist', function() {
        it('readFixed', function(done) {
            const doc = DATA.GENERATE_FAKE_DOC();
            DocMeta.readFixed(doc, (err) => {
                ERR.EXPECT(err, 'not_found');
                DOC.EXPECT_DOES_NOT_EXIST(doc.id, done);
            });
        });
        it('read', function(done) {
            DocMeta.read(DATA.Model, DATA.id, (err) => {
                ERR.EXPECT(err, 'not_found');
                DOC.EXPECT_DOES_NOT_EXIST(DATA.id, done);
            });
        });
        it('headFixed', function(done) {
            const doc = DATA.GENERATE_FAKE_DOC();
            DocMeta.headFixed(doc, (err) => {
                ERR.EXPECT(err, 'not_found');
                DOC.EXPECT_DOES_NOT_EXIST(doc.id, done);
            });
        });
        it('head', function(done) {
            DocMeta.head(DATA.Model, DATA.id, (err) => {
                ERR.EXPECT(err, 'not_found');
                DOC.EXPECT_DOES_NOT_EXIST(DATA.id, done);
            });
        });
        it('writeFixed', function(done) {
            const doc = DATA.GENERATE_FAKE_DOC();
            const oldRev = doc.rev;
            DocMeta.writeFixed(doc, DATA.doc2, (err) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_NOT_REV(doc, oldRev);
                BODY.EXPECT_LATEST_REV(doc, doc.rev);
                BODY.EXPECT(doc, DATA.doc2);
                DOC.EXPECT_EXISTS(doc.id, DATA.doc2, done);
            });
        });
        it('write', function(done) {
            DocMeta.write(DATA.Model, DATA.id, DATA.doc2, (err, doc) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_LATEST_REV(doc, doc.rev);
                BODY.EXPECT(doc, DATA.doc2);
                DOC.EXPECT_EXISTS(DATA.id, DATA.doc2, done);
            });
        });
        it('updateFixed', function(done) {
            const doc = DATA.GENERATE_FAKE_DOC();
            const oldRev = doc.rev;
            DocMeta.updateFixed(doc, DATA.update2, (err) => {
                ERR.EXPECT(err, 'not_found');
                BODY.EXPECT_REV(doc, oldRev);
                BODY.EXPECT_LATEST_REV(doc, doc.rev);
                DOC.EXPECT_DOES_NOT_EXIST(doc.id, done);
            });
        });
        it('update', function(done) {
            DocMeta.update(DATA.Model, DATA.id, DATA.update2, (err) => {
                ERR.EXPECT(err, 'not_found');
                DOC.EXPECT_DOES_NOT_EXIST(DATA.id, done);
            });
        });
        it('updateOrWrite', function(done) {
            DocMeta.updateOrWrite(DATA.Model, DATA.id, DATA.doc2, (err, doc) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_LATEST_REV(doc, doc.rev);
                BODY.EXPECT(doc, DATA.doc2);
                DOC.EXPECT_EXISTS(DATA.id, DATA.doc2, done);
            });
        });
        it('create', function(done) {
            DocMeta.create(DATA.Model, DATA.doc2, (err, doc) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_LATEST_REV(doc, doc.rev);
                BODY.EXPECT(doc, DATA.doc2);
                DOC.EXPECT_EXISTS(doc.id, DATA.doc2, done);
            });
        });
        it('destroyFixed', function(done) {
            const doc = DATA.GENERATE_FAKE_DOC();
            DocMeta.destroyFixed(doc, (err) => {
                ERR.EXPECT(err, 'not_found');
                DOC.EXPECT_DOES_NOT_EXIST(doc.id, done);
            });
        });
        it('destroy', function(done) {
            DocMeta.destroy(DATA.Model, DATA.id, (err) => {
                ERR.EXPECT(err, 'not_found');
                DOC.EXPECT_DOES_NOT_EXIST(DATA.id, done);
            });
        });
    });
    describe('database exists', function() {
        beforeEach(DB.CREATE);
        describe('document does not exist', function() {
            it('readFixed', function(done) {
                DocMeta.readFixed(DATA.GENERATE_FAKE_DOC(), (err) => {
                    ERR.EXPECT(err, 'not_found');
                    DOC.EXPECT_DOES_NOT_EXIST(DATA.id, done);
                });
            });
            it('read', function(done) {
                DocMeta.read(DATA.Model, DATA.id, (err) => {
                    ERR.EXPECT(err, 'not_found');
                    DOC.EXPECT_DOES_NOT_EXIST(DATA.id, done);
                });
            });
            it('headFixed', function(done) {
                const doc = DATA.GENERATE_FAKE_DOC();
                DocMeta.headFixed(doc, (err) => {
                    ERR.EXPECT(err, 'not_found');
                    DOC.EXPECT_DOES_NOT_EXIST(doc.id, done);
                });
            });
            it('head', function(done) {
                DocMeta.head(DATA.Model, DATA.id, (err) => {
                    ERR.EXPECT(err, 'not_found');
                    DOC.EXPECT_DOES_NOT_EXIST(DATA.id, done);
                });
            });
            it('writeFixed', function(done) {
                const doc = DATA.GENERATE_FAKE_DOC();
                const oldRev = doc.rev;
                DocMeta.writeFixed(doc, DATA.doc2, (err) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_NOT_REV(doc, oldRev);
                    BODY.EXPECT_LATEST_REV(doc, doc.rev);
                    BODY.EXPECT(doc, DATA.doc2);
                    DOC.EXPECT_EXISTS(doc.id, DATA.doc2, done);
                });
            });
            it('write', function(done) {
                DocMeta.write(DATA.Model, DATA.id, DATA.doc2, (err, doc) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_LATEST_REV(doc, doc.rev);
                    BODY.EXPECT(doc, DATA.doc2);
                    DOC.EXPECT_EXISTS(DATA.id, DATA.doc2, done);
                });
            });
            it('updateFixed', function(done) {
                const doc = DATA.GENERATE_FAKE_DOC();
                const oldRev = doc.rev;
                DocMeta.updateFixed(doc, DATA.update2, (err) => {
                    ERR.EXPECT(err, 'not_found');
                    BODY.EXPECT_REV(doc, oldRev);
                    BODY.EXPECT_LATEST_REV(doc, doc.rev);
                    DOC.EXPECT_DOES_NOT_EXIST(doc.id, done);
                });
            });
            it('update', function(done) {
                DocMeta.update(DATA.Model, DATA.id, DATA.update2, (err) => {
                    ERR.EXPECT(err, 'not_found');
                    DOC.EXPECT_DOES_NOT_EXIST(DATA.id, done);
                });
            });
            it('updateOrWrite', function(done) {
                DocMeta.updateOrWrite(DATA.Model, DATA.id, DATA.doc2, (err, doc) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_LATEST_REV(doc, doc.rev);
                    BODY.EXPECT(doc, DATA.doc2);
                    DOC.EXPECT_EXISTS(DATA.id, DATA.doc2, done);
                });
            });
            it('create', function(done) {
                DocMeta.create(DATA.Model, DATA.doc2, (err, doc) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_LATEST_REV(doc, doc.rev);
                    BODY.EXPECT(doc, DATA.doc2);
                    DOC.EXPECT_EXISTS(doc.id, DATA.doc2, done);
                });
            });
            it('destroyFixed', function(done) {
                const doc = DATA.GENERATE_FAKE_DOC();
                const oldId = doc.id;
                DocMeta.destroyFixed(doc, (err) => {
                    ERR.EXPECT(err, 'not_found');
                    DOC.EXPECT_DOES_NOT_EXIST(oldId, done);
                });
            });
            it('destroy', function(done) {
                DocMeta.destroy(DATA.Model, DATA.id, (err) => {
                    ERR.EXPECT(err, 'not_found');
                    DOC.EXPECT_DOES_NOT_EXIST(DATA.id, done);
                });
            });
        });
        describe('attachment does not exist', function() {
            let doc;
            beforeEach(function(done) {
                DOC.CREATE(model => { doc = model; done(); });
            });
            describe('document has not been changed', function() {
                it('readFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body);
                    DocMeta.readFixed(doc, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, oldRev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('read', function(done) {
                    DocMeta.read(DATA.Model, doc.id, (err, doc2) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc2, doc.id);
                        BODY.EXPECT_REV(doc2, doc.rev);
                        BODY.EXPECT_LATEST_REV(doc2, doc2.rev);
                        BODY.EXPECT(doc2, doc.body);
                        DOC.EXPECT_EXISTS(doc.id, doc.body, done);
                    });
                });
                it('headFixed', function(done) {
                    const expected = Object.assign({}, doc.body);
                    DocMeta.headFixed(doc, (err, rev) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, rev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('head', function(done) {
                    DocMeta.head(DATA.Model, doc.id, (err, rev) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, rev);
                        DOC.EXPECT_EXISTS(doc.id, doc.body, done);
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.rev;
                    DocMeta.writeFixed(doc, DATA.doc2, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_NOT_REV(doc, oldRev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, DATA.doc2);
                        DOC.EXPECT_EXISTS(doc.id, DATA.doc2, done);
                    });
                });
                it('write', function(done) {
                    DocMeta.write(DATA.Model, doc.id, DATA.doc2, (err, doc2) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc2, doc.id);
                        BODY.EXPECT_NOT_REV(doc2, doc.rev);
                        BODY.EXPECT_LATEST_REV(doc2, doc2.rev);
                        BODY.EXPECT(doc2, DATA.doc2);
                        DOC.EXPECT_EXISTS(doc.id, DATA.doc2, done);
                    });
                });
                it('updateFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body, DATA.update2);
                    DocMeta.updateFixed(doc, DATA.update2, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_NOT_REV(doc, oldRev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('update', function(done) {
                    const expected = Object.assign({}, doc.body, DATA.update2);
                    DocMeta.update(DATA.Model, doc.id, DATA.update2, (err, doc2) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc2, doc.id);
                        BODY.EXPECT_NOT_REV(doc2, doc.rev);
                        BODY.EXPECT_LATEST_REV(doc2, doc2.rev);
                        BODY.EXPECT(doc2, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('updateOrWrite', function(done) {
                    const expected = Object.assign({}, doc.body, DATA.update2);
                    DocMeta.updateOrWrite(DATA.Model, doc.id, DATA.update2, (err, doc2) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc2, doc.id);
                        BODY.EXPECT_NOT_REV(doc2, doc.rev);
                        BODY.EXPECT_LATEST_REV(doc2, doc2.rev);
                        BODY.EXPECT(doc2, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('destroyFixed', function(done) {
                    const oldId = doc.id;
                    DocMeta.destroyFixed(doc, (err) => {
                        ERR.EXPECT_NONE(err);
                        expect(doc.id).to.be.undefined;
                        expect(doc.rev).to.be.undefined;
                        expect(doc._latestRev).to.be.undefined;
                        BODY.EXPECT(doc, {});
                        DOC.EXPECT_DOES_NOT_EXIST(oldId, done);
                    });
                });
                it('destroy', function(done) {
                    DocMeta.destroy(DATA.Model, doc.id, (err) => {
                        ERR.EXPECT_NONE(err);
                        DOC.EXPECT_DOES_NOT_EXIST(doc.id, done);
                    });
                });
                it.skip('find', function(done) {
                    const finder = new Finder(DATA.find);
                    DocMeta.find(DATA.Model, finder, (err, body) => {
                        ERR.EXPECT_NONE(err);
                        console.log('body', body);
                        done();
                    });
                });
            });
            describe('document changed', function() {
                let doc2;
                beforeEach(function(done) {
                    DOC.CHANGE_IN_BACKGROUND(doc, model => { doc2 = model; done(); });
                });
                it('readFixed', function(done) {
                    DocMeta.readFixed(doc, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, doc2.rev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, doc2.body);
                        DOC.EXPECT_EXISTS(doc.id, doc2.body, done);
                    });
                });
                it('read', function(done) {
                    DocMeta.read(DATA.Model, doc.id, (err, doc3) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc3, doc2.id);
                        BODY.EXPECT_REV(doc3, doc2.rev);
                        BODY.EXPECT_LATEST_REV(doc3, doc3.rev);
                        BODY.EXPECT(doc3, doc2.body);
                        DOC.EXPECT_EXISTS(doc.id, doc2.body, done);
                    });
                });
                it('headFixed', function(done) {
                    const expected = Object.assign({}, doc.body);
                    DocMeta.headFixed(doc, (err, rev) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc2, rev);
                        BODY.EXPECT_NOT_REV(doc, rev);
                        BODY.EXPECT_LATEST_REV(doc, rev);
                        BODY.EXPECT_NOT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        DOC.EXPECT_EXISTS(doc.id, doc2.body, done);
                    });
                });
                it('head', function(done) {
                    DocMeta.head(DATA.Model, doc.id, (err, rev) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc2, rev);
                        DOC.EXPECT_EXISTS(doc.id, doc2.body, done);
                    });
                });
                it('writeFixed', function(done) {
                    DocMeta.writeFixed(doc, DATA.doc2, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_NOT_REV(doc, doc2.rev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, DATA.doc2);
                        DOC.EXPECT_EXISTS(doc.id, DATA.doc2, done);
                    });
                });
                it('write', function(done) {
                    DocMeta.write(DATA.Model, doc.id, DATA.doc2, (err, doc3) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc3, doc2.id);
                        BODY.EXPECT_NOT_REV(doc3, doc2.rev);
                        BODY.EXPECT_LATEST_REV(doc3, doc3.rev);
                        BODY.EXPECT(doc3, DATA.doc2);
                        DOC.EXPECT_EXISTS(doc.id, DATA.doc2, done);
                    });
                });
                it('updateFixed', function(done) {
                    const expected = Object.assign({}, doc2.body, DATA.update2);
                    DocMeta.updateFixed(doc, DATA.update2, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_NOT_REV(doc, doc2.rev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('update', function(done) {
                    const expected = Object.assign({}, doc2.body, DATA.update2);
                    DocMeta.update(DATA.Model, doc.id, DATA.update2, (err, doc3) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc3, doc2.id);
                        BODY.EXPECT_NOT_REV(doc3, doc2.rev);
                        BODY.EXPECT_LATEST_REV(doc3, doc3.rev);
                        BODY.EXPECT(doc3, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('updateOrWrite', function(done) {
                    const expected = Object.assign({}, doc2.body, DATA.update2);
                    DocMeta.updateOrWrite(DATA.Model, doc.id, DATA.update2, (err, doc3) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc3, doc2.id);
                        BODY.EXPECT_NOT_REV(doc3, doc2.rev);
                        BODY.EXPECT_LATEST_REV(doc3, doc3.rev);
                        BODY.EXPECT(doc3, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('destroyFixed', function(done) {
                    DocMeta.destroyFixed(doc, (err) => {
                        ERR.EXPECT_NONE(err);
                        expect(doc.id).to.be.undefined;
                        expect(doc.rev).to.be.undefined;
                        expect(doc._latestRev).to.be.undefined;
                        BODY.EXPECT(doc, {});
                        DOC.EXPECT_DOES_NOT_EXIST(doc2.id, done);
                    });
                });
                it('destroy', function(done) {
                    DocMeta.destroy(DATA.Model, doc.id, (err) => {
                        ERR.EXPECT_NONE(err);
                        DOC.EXPECT_DOES_NOT_EXIST(doc.id, done);
                    });
                });
            });
        });
        describe('attachment exists', function() {
            let doc;
            beforeEach(function(done) {
                DOC.CREATE_WITH_ATTACHMENT(model => { doc = model; done(); });
            });
            describe('document has not been changed', function() {
                it('readFixed', function(done) {
                    const expected = Object.assign({}, doc.body);
                    DocMeta.readFixed(doc, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, expected._rev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('read', function(done) {
                    DocMeta.read(DATA.Model, doc.id, (err, doc2) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc2, doc.id);
                        BODY.EXPECT_REV(doc2, doc.rev);
                        BODY.EXPECT_LATEST_REV(doc2, doc2.rev);
                        BODY.EXPECT(doc2, doc.body);
                        DOC.EXPECT_EXISTS(doc.id, doc.body, done);
                    });
                });
                it('headFixed', function(done) {
                    const expected = Object.assign({}, doc.body);
                    DocMeta.headFixed(doc, (err, rev) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, rev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('head', function(done) {
                    DocMeta.head(DATA.Model, doc.id, (err, rev) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, rev);
                        DOC.EXPECT_EXISTS(doc.id, doc.body, done);
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.rev;
                    DocMeta.writeFixed(doc, DATA.doc2, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_NOT_REV(doc, oldRev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, DATA.doc2);
                        DOC.EXPECT_EXISTS(doc.id, DATA.doc2, done);
                    });
                });
                it('write', function(done) {
                    DocMeta.write(DATA.Model, doc.id, DATA.doc2, (err, doc2) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc2, doc.id);
                        BODY.EXPECT_NOT_REV(doc2, doc.rev);
                        BODY.EXPECT_LATEST_REV(doc2, doc2.rev);
                        BODY.EXPECT(doc2, DATA.doc2);
                        DOC.EXPECT_EXISTS(doc.id, DATA.doc2, done);
                    });
                });
                it('updateFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body, DATA.update2);
                    DocMeta.updateFixed(doc, DATA.update2, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_NOT_REV(doc, oldRev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('update', function(done) {
                    const expected = Object.assign({}, doc.body, DATA.update2);
                    DocMeta.update(DATA.Model, doc.id, DATA.update2, (err, doc2) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc2, doc.id);
                        BODY.EXPECT_NOT_REV(doc2, doc.rev);
                        BODY.EXPECT_LATEST_REV(doc2, doc2.rev);
                        BODY.EXPECT(doc2, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('updateOrWrite', function(done) {
                    const expected = Object.assign({}, doc.body, DATA.update2);
                    DocMeta.updateOrWrite(DATA.Model, doc.id, DATA.update2, (err, doc2) => {
                        BODY.EXPECT_ID(doc2, doc.id);
                        BODY.EXPECT_NOT_REV(doc2, doc.rev);
                        BODY.EXPECT_LATEST_REV(doc2, doc2.rev);
                        BODY.EXPECT(doc2, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('destroyFixed', function(done) {
                    const oldId = doc.id;
                    DocMeta.destroyFixed(doc, (err) => {
                        ERR.EXPECT_NONE(err);
                        expect(doc.id).to.be.undefined;
                        expect(doc.rev).to.be.undefined;
                        expect(doc._latestRev).to.be.undefined;
                        BODY.EXPECT(doc, {});
                        DOC.EXPECT_DOES_NOT_EXIST(oldId, done);
                    });
                });
                it('destroy', function(done) {
                    DocMeta.destroy(DATA.Model, doc.id, (err) => {
                        ERR.EXPECT_NONE(err);
                        DOC.EXPECT_DOES_NOT_EXIST(doc.id, done);
                    });
                });
            });
            describe('document changed', function() {
                let doc2;
                beforeEach(function(done) {
                    DOC.CHANGE_IN_BACKGROUND(doc, model => { doc2 = model; done(); });
                });
                it('readFixed', function(done) {
                    DocMeta.readFixed(doc, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, doc2.rev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, doc2.body);
                        DOC.EXPECT_EXISTS(doc.id, doc2.body, done);
                    });
                });
                it('read', function(done) {
                    DocMeta.read(DATA.Model, doc.id, (err, doc3) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc3, doc2.id);
                        BODY.EXPECT_REV(doc3, doc2.rev);
                        BODY.EXPECT_LATEST_REV(doc3, doc3.rev);
                        BODY.EXPECT(doc3, doc2.body);
                        DOC.EXPECT_EXISTS(doc.id, doc2.body, done);
                    });
                });
                it('headFixed', function(done) {
                    const expected = Object.assign({}, doc.body);
                    DocMeta.headFixed(doc, (err, rev) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc2, rev);
                        BODY.EXPECT_NOT_REV(doc, rev);
                        BODY.EXPECT_LATEST_REV(doc, rev);
                        BODY.EXPECT(doc, expected);
                        DOC.EXPECT_EXISTS(doc.id, doc2.body, done);
                    });
                });
                it('head', function(done) {
                    DocMeta.head(DATA.Model, doc.id, (err, rev) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc2, rev);
                        DOC.EXPECT_EXISTS(doc.id, doc2.body, done);
                    });
                });
                it('writeFixed', function(done) {
                    DocMeta.writeFixed(doc, DATA.doc2, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_NOT_REV(doc, doc2.rev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, DATA.doc2);
                        DOC.EXPECT_EXISTS(doc.id, DATA.doc2, done);
                    });
                });
                it('write', function(done) {
                    DocMeta.write(DATA.Model, doc.id, DATA.doc2, (err, doc3) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc3, doc2.id);
                        BODY.EXPECT_NOT_REV(doc3, doc2.rev);
                        BODY.EXPECT_LATEST_REV(doc3, doc3.rev);
                        BODY.EXPECT(doc3, DATA.doc2);
                        DOC.EXPECT_EXISTS(doc.id, DATA.doc2, done);
                    });
                });
                it('updateFixed', function(done) {
                    const expected = Object.assign({}, doc2.body, DATA.update2);
                    DocMeta.updateFixed(doc, DATA.update2, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_NOT_REV(doc, doc2.rev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('update', function(done) {
                    const expected = Object.assign({}, doc2.body, DATA.update2);
                    DocMeta.update(DATA.Model, doc.id, DATA.update2, (err, doc3) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc3, doc2.id);
                        BODY.EXPECT_NOT_REV(doc3, doc2.rev);
                        BODY.EXPECT_LATEST_REV(doc3, doc3.rev);
                        BODY.EXPECT(doc3, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('updateOrWrite', function(done) {
                    const expected = Object.assign({}, doc2.body, DATA.update2);
                    DocMeta.updateOrWrite(DATA.Model, doc.id, DATA.update2, (err, doc3) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_ID(doc3, doc2.id);
                        BODY.EXPECT_NOT_REV(doc3, doc2.rev);
                        BODY.EXPECT_LATEST_REV(doc3, doc3.rev);
                        BODY.EXPECT(doc3, expected);
                        DOC.EXPECT_EXISTS(doc.id, expected, done);
                    });
                });
                it('destroyFixed', function(done) {
                    const oldId = doc.id;
                    DocMeta.destroyFixed(doc, (err) => {
                        ERR.EXPECT_NONE(err);
                        expect(doc.id).to.be.undefined;
                        expect(doc.rev).to.be.undefined;
                        expect(doc._latestRev).to.be.undefined;
                        BODY.EXPECT(doc, {});
                        DOC.EXPECT_DOES_NOT_EXIST(oldId, done);
                    });
                });
                it('destroy', function(done) {
                    DocMeta.destroy(DATA.Model, doc.id, (err) => {
                        ERR.EXPECT_NONE(err);
                        DOC.EXPECT_DOES_NOT_EXIST(doc.id, done);
                    });
                });
            });
        });
    });
});
