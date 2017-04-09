'use strict';
const mocha = require('mocha');

const AttachmentMeta = require('../../lib/meta/attachment-meta');

const ATTACHMENT = require('../helpers/attachment-helpers');
const BODY = require('../helpers/body-helpers');
const DATA = require('../helpers/data-helpers');
const DB = require('../helpers/db-helpers');
const DOC = require('../helpers/doc-helpers');
const ERR = require('../helpers/err-helpers');

describe('AttachmentMeta', function() {
    beforeEach(DB.DESTROY);
    describe('database does not exist', function() {
        it('readFixed', function(done) {
            const doc = DATA.GENERATE_FAKE_DOC();
            AttachmentMeta.readFixed(doc, DATA.attname, (err) => {
                ERR.EXPECT(err, 'not_found');
                ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
            });
        });
        it('read', function(done) {
            AttachmentMeta.read(DATA.Model, DATA.id, DATA.attname, (err) => {
                ERR.EXPECT(err, 'not_found');
                ATTACHMENT.EXPECT_DOES_NOT_EXIST(DATA.id, DATA.attname, done);
            });
        });
        it('writeFixed', function(done) {
            const doc = DATA.GENERATE_FAKE_DOC();
            AttachmentMeta.writeFixed(doc, DATA.attname, DATA.file, (err) => {
                ERR.EXPECT(err, 'not_found');
                ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
            });
        });
        it('write', function(done) {
            AttachmentMeta.write(DATA.Model, DATA.id, DATA.attname, DATA.file, (err) => {
                ERR.EXPECT(err, 'not_found');
                ATTACHMENT.EXPECT_DOES_NOT_EXIST(DATA.id, DATA.attname, done);
            });
        });
        it('destroyFixed', function(done) {
            const doc = DATA.GENERATE_FAKE_DOC();
            AttachmentMeta.destroyFixed(doc, DATA.attname, (err) => {
                ERR.EXPECT(err, 'not_found');
                ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
            });
        });
        it('destroy', function(done) {
            AttachmentMeta.destroy(DATA.Model, DATA.id, DATA.attname, (err) => {
                ERR.EXPECT(err, 'not_found');
                ATTACHMENT.EXPECT_DOES_NOT_EXIST(DATA.id, DATA.attname, done);
            });
        });
    });
    describe('database exists', function() {
        beforeEach(DB.CREATE);
        describe('document does not exist', function() {
            it('readFixed', function(done) {
                const doc = DATA.GENERATE_FAKE_DOC();
                AttachmentMeta.readFixed(doc, DATA.attname, (err) => {
                    ERR.EXPECT(err, 'not_found');
                    ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                });
            });
            it('read', function(done) {
                AttachmentMeta.read(DATA.Model, DATA.id, DATA.attname, (err) => {
                    ERR.EXPECT(err, 'not_found');
                    ATTACHMENT.EXPECT_DOES_NOT_EXIST(DATA.id, DATA.attname, done);
                });
            });
            it('writeFixed', function(done) {
                const doc = DATA.GENERATE_FAKE_DOC();
                AttachmentMeta.writeFixed(doc, DATA.attname, DATA.file, (err) => {
                    ERR.EXPECT(err, 'not_found');
                    ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                });
            });
            it('write', function(done) {
                AttachmentMeta.write(DATA.Model, DATA.id, DATA.attname, DATA.file, (err) => {
                    ERR.EXPECT(err, 'not_found');
                    ATTACHMENT.EXPECT_DOES_NOT_EXIST(DATA.id, DATA.attname, done);
                });
            });
            it('destroyFixed', function(done) {
                const doc = DATA.GENERATE_FAKE_DOC();
                AttachmentMeta.destroyFixed(doc, DATA.attname, (err) => {
                    ERR.EXPECT(err, 'not_found');
                    ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                });
            });
            it('destroy', function(done) {
                AttachmentMeta.destroy(DATA.Model, DATA.id, DATA.attname, (err) => {
                    ERR.EXPECT(err, 'not_found');
                    ATTACHMENT.EXPECT_DOES_NOT_EXIST(DATA.id, DATA.attname, done);
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
                    AttachmentMeta.readFixed(doc, DATA.attname, (err) => {
                        ERR.EXPECT(err, 'not_found');
                        BODY.EXPECT_REV(doc, oldRev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(DATA.Model, doc.id, DATA.attname, (err) => {
                        ERR.EXPECT(err, 'not_found');
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body, {
                        _attachments: {
                            [DATA.attname]: DATA.file
                        }
                    });
                    AttachmentMeta.writeFixed(doc, DATA.attname, DATA.file, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, oldRev);
                        BODY.EXPECT_NOT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, done);
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(DATA.Model, doc.id, DATA.attname, DATA.file, (err) => {
                        ERR.EXPECT_NONE(err);
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, done);
                    });
                });
                it('destroyFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body);
                    AttachmentMeta.destroyFixed(doc, DATA.attname, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, oldRev);
                        BODY.EXPECT_NOT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                    });
                });
                it('destroy', function(done) {
                    AttachmentMeta.destroy(DATA.Model, doc.id, DATA.attname, (err) => {
                        ERR.EXPECT_NONE(err);
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                    });
                });
            });
            describe('document changed', function() {
                let doc2;
                beforeEach(function(done) {
                    DOC.CHANGE_IN_BACKGROUND(doc, model => { doc2 = model; done(); });
                });
                it('readFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body, { _attachments: undefined });
                    AttachmentMeta.readFixed(doc, DATA.attname, (err) => {
                        ERR.EXPECT(err, 'not_found');
                        BODY.EXPECT_REV(doc, oldRev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(DATA.Model, doc.id, DATA.attname, (err) => {
                        ERR.EXPECT(err, 'not_found');
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body, {
                        _attachments: {
                            [DATA.attname]: DATA.file
                        }
                    });
                    AttachmentMeta.writeFixed(doc, DATA.attname, DATA.file, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, oldRev);
                        BODY.EXPECT_NOT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, done);
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(DATA.Model, doc.id, DATA.attname, DATA.file, (err) => {
                        ERR.EXPECT_NONE(err);
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, done);
                    });
                });
                it('destroyFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body, { _attachments: undefined });
                    AttachmentMeta.destroyFixed(doc, DATA.attname, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, oldRev);
                        BODY.EXPECT_NOT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                    });
                });
                it('destroy', function(done) {
                    AttachmentMeta.destroy(DATA.Model, doc.id, DATA.attname, (err) => {
                        ERR.EXPECT_NONE(err);
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
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
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body, {
                        _attachments: Object.assign({}, doc.body._attachments)
                    });
                    AttachmentMeta.readFixed(doc, DATA.attname, (err, body) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, oldRev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        ATTACHMENT.EXPECT(body, DATA.file.body);
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, done);
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(DATA.Model, doc.id, DATA.attname, (err, body) => {
                        ERR.EXPECT_NONE(err);
                        ATTACHMENT.EXPECT(body, DATA.file.body);
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, done);
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body, {
                        _attachments: {
                            [DATA.attname]: DATA.file2
                        }
                    });
                    AttachmentMeta.writeFixed(doc, DATA.attname, DATA.file2, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, oldRev);
                        BODY.EXPECT_NOT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file2.body, done);
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(DATA.Model, doc.id, DATA.attname, DATA.file2, (err) => {
                        ERR.EXPECT_NONE(err);
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file2.body, done);
                    });
                });
                it('destroyFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body, { _attachments: undefined });
                    AttachmentMeta.destroyFixed(doc, DATA.attname, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, oldRev);
                        BODY.EXPECT_NOT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                    });
                });
                it('destroy', function(done) {
                    AttachmentMeta.destroy(DATA.Model, doc.id, DATA.attname, (err) => {
                        ERR.EXPECT_NONE(err);
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                    });
                });
            });
            describe('document changed', function() {
                let doc2;
                beforeEach(function(done) {
                    DOC.CHANGE_IN_BACKGROUND(doc, model => { doc2 = model; done(); });
                });
                it('readFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body, {
                        _attachments: Object.assign({}, doc.body._attachments)
                    });
                    AttachmentMeta.readFixed(doc, DATA.attname, (err, body) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, oldRev);
                        BODY.EXPECT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        ATTACHMENT.EXPECT(body, DATA.file.body);
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, done);
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(DATA.Model, doc.id, DATA.attname, (err, body) => {
                        ERR.EXPECT_NONE(err);
                        ATTACHMENT.EXPECT(body, DATA.file.body);
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, done);
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body, {
                        _attachments: {
                            [DATA.attname]: DATA.file2
                        }
                    });
                    AttachmentMeta.writeFixed(doc, DATA.attname, DATA.file2, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, oldRev);
                        BODY.EXPECT_NOT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file2.body, done);
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(DATA.Model, doc.id, DATA.attname, DATA.file2, (err) => {
                        ERR.EXPECT_NONE(err);
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file2.body, done);
                    });
                });
                it('destroyFixed', function(done) {
                    const oldRev = doc.rev;
                    const expected = Object.assign({}, doc.body, { _attachments: undefined });
                    AttachmentMeta.destroyFixed(doc, DATA.attname, (err) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_REV(doc, oldRev);
                        BODY.EXPECT_NOT_LATEST_REV(doc, doc.rev);
                        BODY.EXPECT(doc, expected);
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                    });
                });
                it('destroy', function(done) {
                    AttachmentMeta.destroy(DATA.Model, doc.id, DATA.attname, (err) => {
                        ERR.EXPECT_NONE(err);
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                    });
                });
            });
        });
    });
});
