'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const DocMeta = require('../../lib/meta/doc-meta');
const Helpers = require('../Helpers');

describe('DocMeta multipart', function() {
    beforeEach(Helpers.RESET_DB);
    describe('document does not exist', function() {
        describe('write', function() {
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
                    Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file.body, () => {
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, body, done);
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
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, body, () => {
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file.body, () => {
                            Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname2, Helpers.data.file2.body, done);
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
                    Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, new Buffer(file.body, 'binary'), () => {
                        Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, body, done);
                    });
                });
            });
        });
    });
    describe('attachment exists', function() {
        let doc;
        beforeEach(function(done) {
            Helpers.CREATE_DOC_WITH_ATTACHMENT(model => { doc = model; done(); });
        });
        describe('write', function() {
            it('should write a document with attachment', function(done) {
                const body = Object.assign({}, Helpers.data.doc2, {
                    _attachments: {
                        [Helpers.data.attname2]: Helpers.data.file2
                    }
                });
                DocMeta.write(Helpers.Model, doc.id, body, (err, doc2) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_DOC_BODY(doc2.body, body);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc2, Helpers.data.attname2);
                    Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST(doc2, Helpers.data.attname);
                    Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname2, Helpers.data.file2.body, () => {
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, () => {
                            Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, body, done);
                        });
                    });
                });
            });
            it('should write a document with multiple attachments', function(done) {
                const body = Object.assign({}, Helpers.data.doc2, {
                    _attachments: {
                        [Helpers.data.attname]: Helpers.data.file,
                        [Helpers.data.attname2]: Helpers.data.file2
                    }
                });
                DocMeta.write(Helpers.Model, doc.id, body, (err, doc2) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_DOC_BODY(doc2.body, body);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc2, Helpers.data.attname);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc2, Helpers.data.attname2);
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, body, () => {
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file.body, () => {
                            Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname2, Helpers.data.file2.body, done);
                        });
                    });
                });
            });
            it('should write a document with text encoded attachment', function(done) {
                const file = {
                    contentType: 'text/html',
                    body: "Hi I'm some data"
                };
                const body = Object.assign({}, Helpers.data.doc2, {
                    _attachments: {
                        [Helpers.data.attname2]: file
                    }
                });
                DocMeta.write(Helpers.Model, doc.id, body, (err, doc2) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_DOC_BODY(doc2.body, body);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc2, Helpers.data.attname2);
                    Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST(doc2, Helpers.data.attname);
                    Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname2, new Buffer(file.body, 'binary'), () => {
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, () => {
                            Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, body, done);
                        });
                    });
                });
            });
        });
        describe('writeFixed', function() {
            it('should write a document with attachment', function(done) {
                const body = Object.assign({}, Helpers.data.doc2, {
                    _attachments: {
                        [Helpers.data.attname2]: Helpers.data.file2
                    }
                });
                DocMeta.writeFixed(doc, body, (err) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_DOC_BODY(doc.body, body);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname2);
                    Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST(doc, Helpers.data.attname);
                    Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname2, Helpers.data.file2.body, () => {
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, () => {
                            Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, body, done);
                        });
                    });
                });
            });
            it('should write a document with multiple attachments', function(done) {
                const body = Object.assign({}, Helpers.data.doc2, {
                    _attachments: {
                        [Helpers.data.attname]: Helpers.data.file,
                        [Helpers.data.attname2]: Helpers.data.file2
                    }
                });
                DocMeta.writeFixed(doc, body, (err) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_DOC_BODY(doc.body, body);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname2);
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, body, () => {
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file.body, () => {
                            Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname2, Helpers.data.file2.body, done);
                        });
                    });
                });
            });
            it('should write a document with text encoded attachment', function(done) {
                const file = {
                    contentType: 'text/html',
                    body: "Hi I'm some data"
                };
                const body = Object.assign({}, Helpers.data.doc2, {
                    _attachments: {
                        [Helpers.data.attname2]: file
                    }
                });
                DocMeta.writeFixed(doc, body, (err) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_DOC_BODY(doc.body, body);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname2);
                    Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST(doc, Helpers.data.attname);
                    Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname2, new Buffer(file.body, 'binary'), () => {
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, () => {
                            Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, body, done);
                        });
                    });
                });
            });
        });
        describe('update', function() {
            it('updates a document with new attachment', function(done) {
                const body = Object.assign({}, Helpers.data.update, {
                    _attachments: {
                        [Helpers.data.attname2]: Helpers.data.file2
                    }
                });
                const expected = Object.assign({}, doc.body, Helpers.data.update, {
                    _attachments: {
                        [Helpers.data.attname]: Helpers.data.file,
                        [Helpers.data.attname2]: Helpers.data.file2
                    }
                });
                DocMeta.update(Helpers.Model, doc.id, body, (err, doc2) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc2, Helpers.data.attname);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc2, Helpers.data.attname2);
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, () => {
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file.body, () => {
                            Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname2, Helpers.data.file2.body, done);
                        });
                    });
                });
            });
            it('updates a document to overwrite an attachment', function(done) {
                const body = Object.assign({}, Helpers.data.update, {
                    _attachments: {
                        [Helpers.data.attname]: Helpers.data.file2
                    }
                });
                const expected = Object.assign({}, doc.body, Helpers.data.update, {
                    _attachments: {
                        [Helpers.data.attname]: Helpers.data.file2,
                    }
                });
                DocMeta.update(Helpers.Model, doc.id, body, (err, doc2) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc2, Helpers.data.attname);
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, () => {
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file2.body, done);
                    });
                });
            });
            it('updates a document with new attachment deletes old attachment', function(done) {
                const body = Object.assign({}, Helpers.data.update, {
                    _attachments: {
                        [Helpers.data.attname]: undefined,
                        [Helpers.data.attname2]: Helpers.data.file2
                    }
                });
                const expected = Object.assign({}, doc.body, Helpers.data.update, {
                    _attachments: {
                        [Helpers.data.attname2]: Helpers.data.file2
                    }
                });
                DocMeta.update(Helpers.Model, doc.id, body, (err, doc2) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                    Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST(doc2, Helpers.data.attname);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc2, Helpers.data.attname2);
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, () => {
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, () => {
                            Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname2, Helpers.data.file2.body, done);
                        });
                    });
                });
            });
            it('updates a document removing all attachments', function(done) {
                const body = Object.assign({}, Helpers.data.update, {
                    _attachments: undefined
                });
                const expected = Object.assign({}, doc.body, Helpers.data.update, {
                    _attachments: undefined
                });
                DocMeta.update(Helpers.Model, doc.id, body, (err, doc2) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_DOC_BODY(doc2.body, expected);
                    Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST(doc2, Helpers.data.attname);
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, () => {
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                    });
                });
            });
        });
        describe('updateFixed', function() {
            it('updates a document with new attachment', function(done) {
                const body = Object.assign({}, Helpers.data.update, {
                    _attachments: {
                        [Helpers.data.attname2]: Helpers.data.file2
                    }
                });
                const expected = Object.assign({}, doc.body, Helpers.data.update, {
                    _attachments: {
                        [Helpers.data.attname]: Helpers.data.file,
                        [Helpers.data.attname2]: Helpers.data.file2
                    }
                });
                DocMeta.updateFixed(doc, body, (err) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_DOC_BODY(doc.body, expected);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname2);
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, () => {
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file.body, () => {
                            Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname2, Helpers.data.file2.body, done);
                        });
                    });
                });
            });
            it('updates a document to overwrite an attachment', function(done) {
                const body = Object.assign({}, Helpers.data.update, {
                    _attachments: {
                        [Helpers.data.attname]: Helpers.data.file2
                    }
                });
                const expected = Object.assign({}, doc.body, Helpers.data.update, {
                    _attachments: {
                        [Helpers.data.attname]: Helpers.data.file2,
                    }
                });
                DocMeta.updateFixed(doc, body, (err) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_DOC_BODY(doc.body, expected);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname);
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, () => {
                        Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname, Helpers.data.file2.body, done);
                    });
                });
            });
            it('updates a document with new attachment deletes old attachment', function(done) {
                const body = Object.assign({}, Helpers.data.update, {
                    _attachments: {
                        [Helpers.data.attname]: undefined,
                        [Helpers.data.attname2]: Helpers.data.file2
                    }
                });
                const expected = Object.assign({}, doc.body, Helpers.data.update, {
                    _attachments: {
                        [Helpers.data.attname2]: Helpers.data.file2
                    }
                });
                DocMeta.updateFixed(doc, body, (err) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_DOC_BODY(doc.body, expected);
                    Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST(doc, Helpers.data.attname);
                    Helpers.EXPECT_ATTACHMENT_STUB_EXISTS(doc, Helpers.data.attname2);
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, () => {
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, () => {
                            Helpers.EXPECT_ATTACHMENT_EXISTS_WITH_BUFFER(doc.id, Helpers.data.attname2, Helpers.data.file2.body, done);
                        });
                    });
                });
            });
            it('updates a document removing all attachments', function(done) {
                const body = Object.assign({}, Helpers.data.update, {
                    _attachments: undefined
                });
                const expected = Object.assign({}, doc.body, Helpers.data.update, {
                    _attachments: undefined
                });
                DocMeta.updateFixed(doc, body, (err) => {
                    Helpers.EXPECT_NO_ERROR(err);
                    Helpers.EXPECT_DOC_BODY(doc.body, expected);
                    Helpers.EXPECT_ATTACHMENT_STUB_DOES_NOT_EXIST(doc, Helpers.data.attname);
                    Helpers.EXPECT_DOC_EXISTS_WITH_BODY(doc.id, expected, () => {
                        Helpers.EXPECT_ATTACHMENT_DOES_NOT_EXIST(doc.id, Helpers.data.attname, done);
                    });
                });
            });
        });
    });
});
