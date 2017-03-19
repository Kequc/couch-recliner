'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const AttachmentMeta = require('../../lib/meta/attachment-meta');
const Helpers = require('../Helpers');

describe('AttachmentMeta', function() {
    beforeEach(Helpers.DESTROY_DB);
    describe('database does not exist', function() {
        it('readFixed', function(done) {
            AttachmentMeta.readFixed(Helpers.GENERATE_DOC(), Helpers.data.attname, (err) => {
                expect(err).to.not.be.undefined;
                expect(err.name).to.equal('not_found');
                done();
            });
        });
        it('read', function(done) {
            AttachmentMeta.read(Helpers.Model, Helpers.data.id, Helpers.data.attname, (err) => {
                expect(err).to.not.be.undefined;
                expect(err.name).to.equal('not_found');
                done();
            });
        });
        it('writeFixed', function(done) {
            AttachmentMeta.writeFixed(Helpers.GENERATE_DOC(), Helpers.data.attname, Helpers.data.file, (err) => {
                expect(err).to.not.be.undefined;
                expect(err.name).to.equal('not_found');
                done();
            });
        });
        it('write', function(done) {
            AttachmentMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.attname, Helpers.data.file, (err) => {
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
                AttachmentMeta.readFixed(Helpers.GENERATE_DOC(), Helpers.data.attname, (err) => {
                    expect(err).to.not.be.undefined;
                    expect(err.name).to.equal('not_found');
                    done();
                });
            });
            it('read', function(done) {
                AttachmentMeta.read(Helpers.Model, Helpers.data.id, Helpers.data.attname, (err) => {
                    expect(err).to.not.be.undefined;
                    expect(err.name).to.equal('not_found');
                    done();
                });
            });
            it('writeFixed', function(done) {
                AttachmentMeta.writeFixed(Helpers.GENERATE_DOC(), Helpers.data.attname, Helpers.data.file, (err) => {
                    expect(err).to.not.be.undefined;
                    expect(err.name).to.equal('not_found');
                    done();
                });
            });
            it('write', function(done) {
                AttachmentMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.attname, Helpers.data.file, (err) => {
                    expect(err).to.not.be.undefined;
                    expect(err.name).to.equal('not_found');
                    done();
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
                        expect(err).to.not.be.undefined;
                        expect(err.name).to.equal('not_found');
                        done();
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(Helpers.Model, doc.getId(), Helpers.data.attname, (err) => {
                        expect(err).to.not.be.undefined;
                        expect(err.name).to.equal('not_found');
                        done();
                    });
                });
                it('writeFixed', function(done) {
                    AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file, (err) => {
                        expect(err).to.be.undefined;
                        expect(doc._latestRev).to.not.equal(doc.getRev());
                        expect(doc.body._attachments).to.not.be.undefined;
                        expect(doc.body._attachments[Helpers.data.attname]).to.not.be.undefined;
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file.buffer, done, doc.getId());
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.attname, Helpers.data.file, (err) => {
                        expect(err).to.be.undefined;
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
                        expect(err).to.not.be.undefined;
                        expect(err.name).to.equal('not_found');
                        done();
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(Helpers.Model, doc.getId(), Helpers.data.attname, (err) => {
                        expect(err).to.not.be.undefined;
                        expect(err.name).to.equal('not_found');
                        done();
                    });
                });
                it('writeFixed', function(done) {
                    AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file, (err) => {
                        expect(err).to.be.undefined;
                        expect(doc._latestRev).to.not.equal(doc.getRev());
                        expect(doc.body._attachments).to.not.be.undefined;
                        expect(doc.body._attachments[Helpers.data.attname]).to.not.be.undefined;
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file.buffer, done, doc.getId());
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.attname, Helpers.data.file, (err) => {
                        expect(err).to.be.undefined;
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
                        expect(err).to.be.undefined;
                        Helpers.EXPECT_ATTACHMENT_BODY(body);
                        done();
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(Helpers.Model, doc.getId(), Helpers.data.attname, (err, body) => {
                        expect(err).to.be.undefined;
                        Helpers.EXPECT_ATTACHMENT_BODY(body);
                        done();
                    });
                });
                it('writeFixed', function(done) {
                    AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file2, (err) => {
                        expect(err).to.be.undefined;
                        expect(doc._latestRev).to.not.equal(doc.getRev());
                        expect(doc.body._attachments).to.not.be.undefined;
                        expect(doc.body._attachments[Helpers.data.attname]).to.not.be.undefined;
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file2.buffer, done, doc.getId());
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.attname, Helpers.data.file2, (err) => {
                        expect(err).to.be.undefined;
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
                        expect(err).to.be.undefined;
                        Helpers.EXPECT_ATTACHMENT_BODY(body);
                        done();
                    });
                });
                it('read', function(done) {
                    AttachmentMeta.read(Helpers.Model, doc.getId(), Helpers.data.attname, (err, body) => {
                        expect(err).to.be.undefined;
                        Helpers.EXPECT_ATTACHMENT_BODY(body);
                        done();
                    });
                });
                it('writeFixed', function(done) {
                    AttachmentMeta.writeFixed(doc, Helpers.data.attname, Helpers.data.file2, (err) => {
                        expect(err).to.be.undefined;
                        expect(doc._latestRev).to.not.equal(doc.getRev());
                        expect(doc.body._attachments).to.not.be.undefined;
                        expect(doc.body._attachments[Helpers.data.attname]).to.not.be.undefined;
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file2.buffer, done, doc.getId());
                    });
                });
                it('write', function(done) {
                    AttachmentMeta.write(Helpers.Model, Helpers.data.id, Helpers.data.attname, Helpers.data.file2, (err) => {
                        expect(err).to.be.undefined;
                        Helpers.EXPECT_ATTACHMENT(Helpers.data.file2.buffer, done, doc.getId());
                    });
                });
            });
        });
    });
});
