'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const DocMeta = require('../../lib/meta/doc-meta');
const Helpers = require('../Helpers');

describe('DocMeta multipart', function() {
    beforeEach(Helpers.RESET_DB);
    describe('document does not exist', function() {
        it('should write a document with attachment', function(done) {
            const body = Object.assign({}, Helpers.data.doc, {
                _attachments: {
                    [Helpers.data.attname]: Helpers.data.file
                }
            });
            DocMeta.write(Helpers.Model, Helpers.data.id, body, (err, doc) => {
                Helpers.EXPECT_NO_ERROR(err);
                Helpers.EXPECT_DOC_BODY(doc.body, body);
                Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname);
                Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.getId(), Helpers.data.attname, Helpers.data.file.body, () => {
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.getId(), Helpers.data.doc, done);
                });
            });
        });
        it('should write a document with multiple attachments', function(done) {
            const body = Object.assign({}, Helpers.data.doc, {
                _attachments: {
                    [Helpers.data.attname]: Helpers.data.file,
                    [Helpers.data.attname2]: Helpers.data.file2
                }
            });
            DocMeta.write(Helpers.Model, Helpers.data.id, body, (err, doc) => {
                Helpers.EXPECT_NO_ERROR(err);
                Helpers.EXPECT_DOC_BODY(doc.body, body);
                Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname);
                Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname2);
                Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.getId(), Helpers.data.doc, () => {
                    Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.getId(), Helpers.data.attname, Helpers.data.file.body, () => {
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.getId(), Helpers.data.attname2, Helpers.data.file2.body, done);
                    });
                });
            });
        });
        it('should write a document with text encoded attachment', function(done) {
            const file = {
                contentType: 'text/html',
                body: "Hi I'm some data"
            };
            const body = Object.assign({}, Helpers.data.doc, {
                _attachments: {
                    [Helpers.data.attname]: file
                }
            });
            DocMeta.write(Helpers.Model, Helpers.data.id, body, (err, doc) => {
                Helpers.EXPECT_NO_ERROR(err);
                Helpers.EXPECT_DOC_BODY(doc.body, body);
                Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname);
                Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.getId(), Helpers.data.attname, new Buffer(file.body, 'binary'), () => {
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.getId(), Helpers.data.doc, done);
                });
            });
        });
    });
    describe('document with attachment exists', function() {
        let doc;
        beforeEach(function(done) {
            Helpers.CREATE_DOC_WITH_ATTACHMENT(model => { doc = model; done(); });
        });
        it('updates a document with new attachment', function(done) {
            const body = Object.assign({}, Helpers.data.update, {
                _attachments: {
                    [Helpers.data.attname2]: Helpers.data.file2
                }
            });
            doc.update(body, (err) => {
                Helpers.EXPECT_NO_ERROR(err);
                const expected = Object.assign({
                    _attachments: {
                        [Helpers.data.attname]: Helpers.data.file,
                        [Helpers.data.attname2]: Helpers.data.file2
                    }
                }, Helpers.data.doc, Helpers.data.update);
                Helpers.EXPECT_DOC_BODY(doc.body, expected);
                Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname);
                Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname2);
                Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.getId(), expected, () => {
                    Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.getId(), Helpers.data.attname, Helpers.data.file.body, () => {
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.getId(), Helpers.data.attname2, Helpers.data.file2.body, done);
                    });
                });
            });
        });
    });
});
