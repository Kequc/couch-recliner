'use strict';
const { DocOperations } = require('../lib');

const DATA = require('./helpers/data-helpers');
const BODY = require('./helpers/body-helpers');
const DB = require('./helpers/db-helpers');
const DOC = require('./helpers/doc-helpers');
const ERR = require('./helpers/err-helpers');

describe('Prime DocOperations', function() {
    let doc;
    beforeEach(function(done) {
        DB.RESET(() => {
            DOC.CREATE((model) => { doc = model; done(); });
        });
    });
    describe('readFixed', function() {
        it('returns error on invalid params', function(done) {
            const valid = [doc];
            const invalid = [
                [{}, 'hi']
            ];
            ERR.EXPECT_PARAM_ERRORS(DocOperations.readFixed, valid, invalid, done);
        });
        it('WORKS', function(done) {
            const oldId = doc.id;
            const oldRev = doc.rev;
            DocOperations.readFixed(doc, (err) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT(doc, DATA.doc);
                BODY.EXPECT_ID(doc, oldId);
                BODY.EXPECT_REV(doc, oldRev);
                BODY.EXPECT_LATEST_REV(doc, doc.rev);
                BODY.EXPECT(doc, DATA.doc);
                DOC.EXPECT_EXISTS(oldId, DATA.doc, done);
            });
        });
    });
    describe('read', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model, doc.id];
            const invalid = [
                [{}, 'hi'],
                [0]
            ];
            ERR.EXPECT_PARAM_ERRORS(DocOperations.read, valid, invalid, done);
        });
        it('WORKS', function(done) {
            const oldId = doc.id;
            const oldRev = doc.rev;
            DocOperations.read(DATA.Model, doc.id, (err) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT(doc, DATA.doc);
                BODY.EXPECT_ID(doc, oldId);
                BODY.EXPECT_REV(doc, oldRev);
                BODY.EXPECT_LATEST_REV(doc, doc.rev);
                DOC.EXPECT_EXISTS(oldId, doc.body, done);
            });
        });
    });
    describe('headFixed', function() {
        it('returns error on invalid params', function(done) {
            const valid = [doc];
            const invalid = [
                [{}, 'hi']
            ];
            ERR.EXPECT_PARAM_ERRORS(DocOperations.headFixed, valid, invalid, done);
        });
        it('WORKS', function(done) {
            const oldId = doc.id;
            DocOperations.headFixed(doc, (err, rev) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_ID(doc, oldId);
                BODY.EXPECT_REV(doc, rev);
                BODY.EXPECT_LATEST_REV(doc, doc.rev);
                DOC.EXPECT_EXISTS(oldId, doc.body, done);
            });
        });
    });
    describe('head', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model, doc.id];
            const invalid = [
                [{}, 'hi'],
                [0]
            ];
            ERR.EXPECT_PARAM_ERRORS(DocOperations.head, valid, invalid, done);
        });
        it('WORKS', function(done) {
            const oldId = doc.id;
            DocOperations.head(DATA.Model, doc.id, (err, rev) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_ID(doc, oldId);
                BODY.EXPECT_REV(doc, rev);
                BODY.EXPECT_LATEST_REV(doc, doc.rev);
                DOC.EXPECT_EXISTS(oldId, doc.body, done);
            });
        });
    });
    describe('create', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model, DATA.doc];
            const invalid = [
                [{}, 'hi'],
                [0, 'hi', { _attachments: { [DATA.attname]: {} } }]
            ];
            ERR.EXPECT_PARAM_ERRORS(DocOperations.create, valid, invalid, done);
        });
        it('WORKS', function(done) {
            DocOperations.create(DATA.Model, DATA.doc2, (err, doc2) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT(doc2, DATA.doc2);
                BODY.EXPECT_LATEST_REV(doc2, doc2.rev);
                DOC.EXPECT_EXISTS(doc2.id, doc2.body, done);
            });
        });
    });
    describe('writeFixed', function() {
        it('returns error on invalid params', function(done) {
            const valid = [doc, DATA.doc2];
            const invalid = [
                [{}, 'hi'],
                [0, 'hi', { _attachments: { [DATA.attname]: {} } }]
            ];
            ERR.EXPECT_PARAM_ERRORS(DocOperations.writeFixed, valid, invalid, done);
        });
        it('WORKS', function(done) {
            const oldId = doc.id;
            const oldRev = doc.rev;
            DocOperations.writeFixed(doc, DATA.doc2, (err) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_ID(doc, oldId);
                BODY.EXPECT_NOT_REV(doc, oldRev);
                BODY.EXPECT_LATEST_REV(doc, doc.rev);
                BODY.EXPECT(doc, DATA.doc2);
                DOC.EXPECT_EXISTS(oldId, doc.body, done);
            });
        });
    });
    describe('write', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model, doc.id, DATA.doc2];
            const invalid = [
                [{}, 'hi'],
                [0],
                [0, 'hi', { _attachments: { [DATA.attname]: {} } }]
            ];
            ERR.EXPECT_PARAM_ERRORS(DocOperations.write, valid, invalid, done);
        });
        it('WORKS', function(done) {
            DocOperations.write(DATA.Model, doc.id, DATA.doc2, (err, doc2) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_ID(doc2, doc.id);
                BODY.EXPECT_NOT_REV(doc2, doc.rev);
                BODY.EXPECT_LATEST_REV(doc2, doc2.rev);
                BODY.EXPECT(doc2, DATA.doc2);
                DOC.EXPECT_EXISTS(doc.id, doc2.body, done);
            });
        });
    });
    describe('updateFixed', function() {
        it('returns error on invalid params', function(done) {
            const valid = [doc, DATA.update];
            const invalid = [
                [{}, 'hi'],
                [0, 'hi', { _attachments: { [DATA.attname]: {} } }]
            ];
            ERR.EXPECT_PARAM_ERRORS(DocOperations.updateFixed, valid, invalid, done);
        });
        it('WORKS', function(done) {
            const oldId = doc.id;
            const oldRev = doc.rev;
            const expected = Object.assign({}, doc.body, DATA.update);
            DocOperations.updateFixed(doc, DATA.update, (err) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_ID(doc, oldId);
                BODY.EXPECT_NOT_REV(doc, oldRev);
                BODY.EXPECT_LATEST_REV(doc, doc.rev);
                BODY.EXPECT(doc, expected);
                DOC.EXPECT_EXISTS(oldId, expected, done);
            });
        });
    });
    describe('update', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model, doc.id, DATA.update];
            const invalid = [
                [{}, 'hi'],
                [0],
                [0, 'hi', { _attachments: { [DATA.attname]: {} } }]
            ];
            ERR.EXPECT_PARAM_ERRORS(DocOperations.update, valid, invalid, done);
        });
        it('WORKS', function(done) {
            const expected = Object.assign({}, doc.body, DATA.update);
            DocOperations.update(DATA.Model, doc.id, DATA.update, (err, doc2) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_ID(doc2, doc.id);
                BODY.EXPECT_NOT_REV(doc2, doc.rev);
                BODY.EXPECT_LATEST_REV(doc2, doc2.rev);
                BODY.EXPECT(doc2, expected);
                DOC.EXPECT_EXISTS(doc.id, expected, done);
            });
        });
    });
    describe('updateOrWrite', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model, doc.id, DATA.update];
            const invalid = [
                [{}, 'hi'],
                [0],
                [0, 'hi', { _attachments: { [DATA.attname]: {} } }]
            ];
            ERR.EXPECT_PARAM_ERRORS(DocOperations.updateOrWrite, valid, invalid, done);
        });
        it('WORKS', function(done) {
            const expected = Object.assign({}, doc.body, DATA.update);
            DocOperations.updateOrWrite(DATA.Model, doc.id, DATA.update, (err, doc2) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_ID(doc2, doc.id);
                BODY.EXPECT_NOT_REV(doc2, doc.rev);
                BODY.EXPECT_LATEST_REV(doc2, doc2.rev);
                BODY.EXPECT(doc2, expected);
                DOC.EXPECT_EXISTS(doc.id, expected, done);
            });
        });
    });
    describe('destroyFixed', function() {
        it('returns error on invalid params', function(done) {
            const valid = [doc];
            const invalid = [
                [{}, 'hi']
            ];
            ERR.EXPECT_PARAM_ERRORS(DocOperations.destroyFixed, valid, invalid, done);
        });
        it('WORKS', function(done) {
            const oldId = doc.id;
            DocOperations.destroyFixed(doc, (err) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT(doc, {});
                BODY.EXPECT_ID(doc, undefined);
                BODY.EXPECT_REV(doc, undefined);
                BODY.EXPECT_LATEST_REV(doc, undefined);
                DOC.EXPECT_DOES_NOT_EXIST(oldId, done);
            });
        });
    });
    describe('destroy', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model, doc.id];
            const invalid = [
                [{}, 'hi'],
                [0]
            ];
            ERR.EXPECT_PARAM_ERRORS(DocOperations.destroy, valid, invalid, done);
        });
        it('WORKS', function(done) {
            DocOperations.destroy(DATA.Model, doc.id, (err) => {
                ERR.EXPECT_NONE(err);
                DOC.EXPECT_DOES_NOT_EXIST(doc.id, done);
            });
        });
    });
});
