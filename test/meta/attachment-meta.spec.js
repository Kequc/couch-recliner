'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const AttachmentMeta = require('../../lib/meta/attachment-meta');
const Helpers = require('../Helpers');

describe('AttachmentMeta', function() {
    beforeEach(Helpers.DESTROY_DB);
    describe('database does not exist', function() {
        it('readFixed', function(done) {
            const doc = Helpers.GENERATE_FAKE_DOC();
            AttachmentMeta.readFixed(doc, Helpers.data.attname, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
            });
        });
        it('read', function(done) {
            AttachmentMeta.read(Helpers.Model, Helpers.data.id, Helpers.data.attname, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(Helpers.data.id, Helpers.data.attname, done);
            });
        });
        it('writeFixed', function(done) {
            const doc = Helpers.GENERATE_FAKE_DOC();
            AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
            });
        });
        it('write', function(done) {
            AttachmentMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.attname, Helpers.data.file, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(Helpers.data.id, Helpers.data.attname, done);
            });
        });
        it('destroyFixed', function(done) {
            const doc = Helpers.GENERATE_FAKE_DOC();
            AttachmentMeta.destroyFixed(doc, Helpers.data.attname, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
            });
        });
        it('destroy', function(done) {
            AttachmentMeta.destroy(Helpers.Model, Helpers.data.id, Helpers.data.attname, (err) => {
                Helpers.EXPECT_ERROR(err, 'not_found');
                Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(Helpers.data.id, Helpers.data.attname, done);
            });
        });
    });
    describe('database exists', function() {
        beforeEach(Helpers.CREATE_DB);
        describe('document does not exist', function() {
            it('readFixed', function(done) {
                const doc = Helpers.GENERATE_FAKE_DOC();
                AttachmentMeta.readFixed(doc, Helpers.data.attname, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                });
            });
            it('read', function(done) {
                AttachmentMeta.read(Helpers.Model, Helpers.data.id, Helpers.data.attname, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(Helpers.data.id, Helpers.data.attname, done);
                });
            });
            it('writeFixed', function(done) {
                const doc = Helpers.GENERATE_FAKE_DOC();
                AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                });
            });
            it('write', function(done) {
                AttachmentMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.attname, Helpers.data.file, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(Helpers.data.id, Helpers.data.attname, done);
                });
            });
            it('destroyFixed', function(done) {
                const doc = Helpers.GENERATE_FAKE_DOC();
                AttachmentMeta.destroyFixed(doc, Helpers.data.attname, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                });
            });
            it('destroy', function(done) {
                AttachmentMeta.destroy(Helpers.Model, Helpers.data.id, Helpers.data.attname, (err) => {
                    Helpers.EXPECT_ERROR(err, 'not_found');
                    Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(Helpers.data.id, Helpers.data.attname, done);
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
                    AttachmentMeta.readFixed(doc, Helpers.data.attname, (err, body) => {
                        Helpers.EXPECT_ERROR(err, 'not_found');
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST(doc, Helpers.data.attname);
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(Helpers.Model, doc.id, Helpers.data.attname, (err) => {
                        Helpers.EXPECT_ERROR(err, 'not_found');
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.rev;
                    AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV_CHANGED(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname);
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file.body, done);
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(Helpers.Model, doc.id, Helpers.data.attname, Helpers.data.file, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file.body, done);
                    });
                });
                it('destroyFixed', function(done) {
                    const oldRev = doc.rev;
                    AttachmentMeta.destroyFixed(doc, Helpers.data.attname, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV_CHANGED(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST(doc, Helpers.data.attname);
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                    });
                });
                it('destroy', function(done) {
                    AttachmentMeta.destroy(Helpers.Model, doc.id, Helpers.data.attname, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                    });
                });
            });
            describe('document changed', function() {
                let doc2;
                beforeEach(function(done) {
                    Helpers.CHANGE_DOC_IN_BACKGROUND(doc, model => { doc2 = model; done(); });
                });
                it('readFixed', function(done) {
                    const oldRev = doc.rev;
                    AttachmentMeta.readFixed(doc, Helpers.data.attname, (err) => {
                        Helpers.EXPECT_ERROR(err, 'not_found');
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST(doc, Helpers.data.attname);
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(Helpers.Model, doc.id, Helpers.data.attname, (err) => {
                        Helpers.EXPECT_ERROR(err, 'not_found');
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.rev;
                    AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV_CHANGED(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname);
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file.body, done);
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(Helpers.Model, doc.id, Helpers.data.attname, Helpers.data.file, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file.body, done);
                    });
                });
                it('destroyFixed', function(done) {
                    const oldRev = doc.rev;
                    AttachmentMeta.destroyFixed(doc, Helpers.data.attname, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV_CHANGED(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST(doc, Helpers.data.attname);
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                    });
                });
                it('destroy', function(done) {
                    AttachmentMeta.destroy(Helpers.Model, doc.id, Helpers.data.attname, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
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
                    const oldRev = doc.rev;
                    AttachmentMeta.readFixed(doc, Helpers.data.attname, (err, body) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname);
                        Helpers.EXPECT_ATTACHMENT_BODY(body, Helpers.data.file.body);
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file.body, done);
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(Helpers.Model, doc.id, Helpers.data.attname, (err, body) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT_BODY(body, Helpers.data.file.body);
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file.body, done);
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.rev;
                    AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file2, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV_CHANGED(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname);
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file2.body, done);
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(Helpers.Model, doc.id, Helpers.data.attname, Helpers.data.file2, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file2.body, done);
                    });
                });
                it('destroyFixed', function(done) {
                    const oldRev = doc.rev;
                    AttachmentMeta.destroyFixed(doc, Helpers.data.attname, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV_CHANGED(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST(doc, Helpers.data.attname);
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                    });
                });
                it('destroy', function(done) {
                    AttachmentMeta.destroy(Helpers.Model, doc.id, Helpers.data.attname, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                    });
                });
            });
            describe('document changed', function() {
                let doc2;
                beforeEach(function(done) {
                    Helpers.CHANGE_DOC_IN_BACKGROUND(doc, model => { doc2 = model; done(); });
                });
                it('readFixed', function(done) {
                    const oldRev = doc.rev;
                    AttachmentMeta.readFixed(doc, Helpers.data.attname, (err, body) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname);
                        Helpers.EXPECT_ATTACHMENT_BODY(body, Helpers.data.file.body);
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file.body, done);
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(Helpers.Model, doc.id, Helpers.data.attname, (err, body) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT_BODY(body, Helpers.data.file.body);
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file.body, done);
                    });
                });
                it('writeFixed', function(done) {
                    const oldRev = doc.rev;
                    AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file2, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV_CHANGED(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname);
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file2.body, done);
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(Helpers.Model, doc.id, Helpers.data.attname, Helpers.data.file2, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file2.body, done);
                    });
                });
                it('destroyFixed', function(done) {
                    const oldRev = doc.rev;
                    AttachmentMeta.destroyFixed(doc, Helpers.data.attname, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_REV(doc, oldRev);
                        Helpers.EXPECT_LATEST_REV_CHANGED(doc);
                        Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST(doc, Helpers.data.attname);
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                    });
                });
                it('destroy', function(done) {
                    AttachmentMeta.destroy(Helpers.Model, doc.id, Helpers.data.attname, (err) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                    });
                });
            });
        });
    });
});
