'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const AttachmentMeta = require('../../lib/meta/attachment-meta');
const Helpers = require('../Helpers');

describe('AttachmentMeta', function() {
    beforeEach(Helpers.DESTROY_DB);
    describe('database does not exist', function() {
        it('readFixed', function(done) {
            const doc = Helpers.GENERATE_DOC();
            AttachmentMeta.readFixed(doc, Helpers.data.attname, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_ATTACHMENT(false, done, doc.getId());
            });
        });
        it('read', function(done) {
            AttachmentMeta.read(Helpers.Model, Helpers.data.id, Helpers.data.attname, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_ATTACHMENT(false, done);
            });
        });
        it('writeFixed', function(done) {
            const doc = Helpers.GENERATE_DOC();
            AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_ATTACHMENT(false, done, doc.getId());
            });
        });
        it('write', function(done) {
            AttachmentMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.attname, Helpers.data.file, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_ATTACHMENT(false, done);
            });
        });
    });
    describe('database exists', function() {
        beforeEach(Helpers.CREATE_DB);
        describe('document does not exist', function() {
            it('readFixed', function(done) {
                const doc = Helpers.GENERATE_DOC();
                AttachmentMeta.readFixed(doc, Helpers.data.attname, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_ATTACHMENT(false, done, doc.getId());
                });
            });
            it('read', function(done) {
                AttachmentMeta.read(Helpers.Model, Helpers.data.id, Helpers.data.attname, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_ATTACHMENT(false, done);
                });
            });
            it('writeFixed', function(done) {
                const doc = Helpers.GENERATE_DOC();
                AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_ATTACHMENT(false, done, doc.getId());
                });
            });
            it('write', function(done) {
                AttachmentMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.attname, Helpers.data.file, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_ATTACHMENT(false, done);
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
                    AttachmentMeta.readFixed(doc, Helpers.data.attname, (err) => {
                        Helpers.EXPECT_ERROR(err, 'not_found');
                        Helpers.EXPECT_ATTACHMENT(false, done, doc.getId());
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(Helpers.Model, doc.getId(), Helpers.data.attname, (err) => {
                        Helpers.EXPECT_ERROR(err, 'not_found');
                        Helpers.EXPECT_ATTACHMENT(false, done, doc.getId());
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.getRev();
                    AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV(doc, false);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc);
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file.buffer, done, doc.getId());
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.attname, Helpers.data.file, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file.buffer, done, doc.getId());
                    });
                });
            });
            describe('document changed', function() {
                let doc2;
                beforeEach(function(done) {
                    Helpers.CHANGE_DOC(doc, model => { doc2 = model; done(); });
                });
                it('readFixed', function(done) {
                    AttachmentMeta.readFixed(doc, Helpers.data.attname, (err) => {
                        Helpers.EXPECT_ERROR(err, 'not_found');
                        Helpers.EXPECT_ATTACHMENT(false, done, doc.getId());
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(Helpers.Model, doc.getId(), Helpers.data.attname, (err) => {
                        Helpers.EXPECT_ERROR(err, 'not_found');
                        Helpers.EXPECT_ATTACHMENT(false, done, doc.getId());
                    });
                });
                it('writeFixed', function(done) {
                    AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_LATEST_REV(doc, false);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc);
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file.buffer, done, doc.getId());
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.attname, Helpers.data.file, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file.buffer, done, doc.getId());
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
                    AttachmentMeta.readFixed(doc, Helpers.data.attname, (err, body) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT_BODY(body);
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file.buffer, done, doc.getId());
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(Helpers.Model, doc.getId(), Helpers.data.attname, (err, body) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT_BODY(body);
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file.buffer, done, doc.getId());
                    });
                });
                it('writeFixed', function(done) {
                    AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file2, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_LATEST_REV(doc, false);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc);
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file2.buffer, done, doc.getId());
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.attname, Helpers.data.file2, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file2.buffer, done, doc.getId());
                    });
                });
            });
            describe('document changed', function() {
                let doc2;
                beforeEach(function(done) {
                    Helpers.CHANGE_DOC(doc, model => { doc2 = model; done(); });
                });
                it('readFixed', function(done) {
                    AttachmentMeta.readFixed(doc, Helpers.data.attname, (err, body) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT_BODY(body);
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file.buffer, done, doc.getId());
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(Helpers.Model, doc.getId(), Helpers.data.attname, (err, body) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT_BODY(body);
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file.buffer, done, doc.getId());
                    });
                });
                it('writeFixed', function(done) {
                    AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file2, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_LATEST_REV(doc, false);
                        Helpers.EXPECT_ATTACHMENT_STUB(doc);
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file2.buffer, done, doc.getId());
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.attname, Helpers.data.file2, (err) => {
                        Helpers.EXPECT_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file2.buffer, done, doc.getId());
                    });
                });
            });
        });
    });
});
