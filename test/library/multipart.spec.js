'use strict';
const DocMeta = require('../../lib/meta/doc-meta');
const Body = require('../../lib/models/body');

const ATTACHMENT = require('../helpers/attachment-helpers');
const BODY = require('../helpers/body-helpers');
const DATA = require('../helpers/data-helpers');
const DB = require('../helpers/db-helpers');
const DOC = require('../helpers/doc-helpers');
const ERR = require('../helpers/err-helpers');

describe('Library multipart', function() {
    beforeEach(DB.RESET);
    describe('document does not exist', function() {
        describe('write', function() {
            it('should write a document with attachment', function(done) {
                const body = new Body(Object.assign({}, DATA.doc, {
                    _attachments: {
                        [DATA.attname]: DATA.file
                    }
                }));
                DocMeta.write(DATA.Model, DATA.id, body, (err, doc) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_ID(doc, DATA.id);
                    BODY.EXPECT(doc, body.forDoc());
                    DOC.EXPECT_EXISTS(doc.id, body.forDoc(), () => {
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, done);
                    });
                });
            });
            it('should write a document with multiple attachments', function(done) {
                const body = new Body(Object.assign({}, DATA.doc, {
                    _attachments: {
                        [DATA.attname]: DATA.file,
                        [DATA.attname2]: DATA.file2
                    }
                }));
                DocMeta.write(DATA.Model, DATA.id, body, (err, doc) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_ID(doc, DATA.id);
                    BODY.EXPECT(doc, body.forDoc());
                    DOC.EXPECT_EXISTS(doc.id, body.forDoc(), () => {
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, () => {
                            ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname2, DATA.file2.body, done);
                        });
                    });
                });
            });
            it('should write a document with text encoded attachment', function(done) {
                const body = new Body(Object.assign({}, DATA.doc, {
                    _attachments: {
                        [DATA.attname]: DATA.fileText
                    }
                }));
                DocMeta.write(DATA.Model, DATA.id, body, (err, doc) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_ID(doc, DATA.id);
                    BODY.EXPECT(doc, body.forDoc());
                    DOC.EXPECT_EXISTS(doc.id, body.forDoc(), () => {
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, new Buffer(DATA.fileText.body, 'binary'), done);
                    });
                });
            });
        });
    });
    describe('attachment exists', function() {
        let doc;
        beforeEach(function(done) {
            DOC.CREATE_WITH_ATTACHMENT(model => { doc = model; done(); });
        });
        describe('write', function() {
            it('should write a document with attachment', function(done) {
                const body = new Body(Object.assign({}, DATA.doc2, {
                    _attachments: {
                        [DATA.attname2]: DATA.file2
                    }
                }));
                DocMeta.write(DATA.Model, doc.id, body, (err, doc2) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_ID(doc2, doc.id);
                    BODY.EXPECT(doc2, body.forDoc());
                    DOC.EXPECT_EXISTS(doc.id, body.forDoc(), () => {
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname2, DATA.file2.body, () => {
                            ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                        });
                    });
                });
            });
            it('should write a document with multiple attachments', function(done) {
                const body = new Body(Object.assign({}, DATA.doc2, {
                    _attachments: {
                        [DATA.attname]: DATA.file,
                        [DATA.attname2]: DATA.file2
                    }
                }));
                DocMeta.write(DATA.Model, doc.id, body, (err, doc2) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_ID(doc2, doc.id);
                    BODY.EXPECT(doc2, body.forDoc());
                    DOC.EXPECT_EXISTS(doc.id, body.forDoc(), () => {
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, () => {
                            ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname2, DATA.file2.body, done);
                        });
                    });
                });
            });
            it('should write a document with text encoded attachment', function(done) {
                const body = new Body(Object.assign({}, DATA.doc2, {
                    _attachments: {
                        [DATA.attname2]: DATA.fileText
                    }
                }));
                DocMeta.write(DATA.Model, doc.id, body, (err, doc2) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_ID(doc2, doc.id);
                    BODY.EXPECT(doc2, body.forDoc());
                    DOC.EXPECT_EXISTS(doc.id, body.forDoc(), () => {
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname2, new Buffer(DATA.fileText.body, 'binary'), () => {
                            ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                        });
                    });
                });
            });
        });
        describe('writeFixed', function() {
            it('should write a document with attachment', function(done) {
                const body = new Body(Object.assign({}, DATA.doc2, {
                    _attachments: {
                        [DATA.attname2]: DATA.file2
                    }
                }));
                DocMeta.writeFixed(doc, body, (err) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT(doc, body.forDoc());
                    DOC.EXPECT_EXISTS(doc.id, body.forDoc(), () => {
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname2, DATA.file2.body, () => {
                            ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                        });
                    });
                });
            });
            it('should write a document with multiple attachments', function(done) {
                const body = new Body(Object.assign({}, DATA.doc2, {
                    _attachments: {
                        [DATA.attname]: DATA.file,
                        [DATA.attname2]: DATA.file2
                    }
                }));
                DocMeta.writeFixed(doc, body, (err) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT(doc, body.forDoc());
                    DOC.EXPECT_EXISTS(doc.id, body.forDoc(), () => {
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, () => {
                            ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname2, DATA.file2.body, done);
                        });
                    });
                });
            });
            it('should write a document with text encoded attachment', function(done) {
                const body = new Body(Object.assign({}, DATA.doc2, {
                    _attachments: {
                        [DATA.attname2]: DATA.fileText
                    }
                }));
                DocMeta.writeFixed(doc, body, (err) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT(doc, body.forDoc());
                    DOC.EXPECT_EXISTS(doc.id, body.forDoc(), () => {
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname2, new Buffer(DATA.fileText.body, 'binary'), () => {
                            ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                        });
                    });
                });
            });
        });
        describe('update', function() {
            it('updates a document with new attachment', function(done) {
                const body = new Body(Object.assign({}, DATA.update, {
                    _attachments: {
                        [DATA.attname2]: DATA.file2
                    }
                }));
                const expected = BODY.DEEP_EXTEND(doc.body, DATA.update, {
                    _attachments: {
                        [DATA.attname]: DATA.file,
                        [DATA.attname2]: DATA.file2
                    }
                });
                DocMeta.update(DATA.Model, doc.id, body, (err, doc2) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT(doc2, expected);
                    DOC.EXPECT_EXISTS(doc.id, expected, () => {
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, () => {
                            ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname2, DATA.file2.body, done);
                        });
                    });
                });
            });
            it('updates a document to overwrite an attachment', function(done) {
                const body = new Body(Object.assign({}, DATA.update, {
                    _attachments: {
                        [DATA.attname]: DATA.file2
                    }
                }));
                const expected = BODY.DEEP_EXTEND(doc.body, DATA.update, {
                    _attachments: {
                        [DATA.attname]: DATA.file2
                    }
                });
                DocMeta.update(DATA.Model, doc.id, body, (err, doc2) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT(doc2, expected);
                    DOC.EXPECT_EXISTS(doc.id, expected, () => {
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file2.body, done);
                    });
                });
            });
            it('updates a document with new attachment deletes old attachment', function(done) {
                const body = new Body(Object.assign({}, DATA.update, {
                    _attachments: {
                        [DATA.attname]: undefined,
                        [DATA.attname2]: DATA.file2
                    }
                }));
                const expected = Object.assign(BODY.DEEP_EXTEND(doc.body, DATA.update), {
                    _attachments: {
                        [DATA.attname2]: DATA.file2
                    }
                });
                DocMeta.update(DATA.Model, doc.id, body, (err, doc2) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT(doc2, expected);
                    DOC.EXPECT_EXISTS(doc.id, expected, () => {
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, () => {
                            ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname2, DATA.file2.body, done);
                        });
                    });
                });
            });
            it('updates a document removing all attachments', function(done) {
                const body = new Body(Object.assign({}, DATA.update, {
                    _attachments: undefined
                }));
                const expected = BODY.DEEP_EXTEND(doc.body, DATA.update, {
                    _attachments: undefined
                });
                DocMeta.update(DATA.Model, doc.id, body, (err, doc2) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT(doc2, expected);
                    DOC.EXPECT_EXISTS(doc.id, expected, () => {
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                    });
                });
            });
        });
        describe('updateFixed', function() {
            it('updates a document with new attachment', function(done) {
                const body = new Body(Object.assign({}, DATA.update, {
                    _attachments: {
                        [DATA.attname2]: DATA.file2
                    }
                }));
                const expected = BODY.DEEP_EXTEND(doc.body, DATA.update, {
                    _attachments: {
                        [DATA.attname]: DATA.file,
                        [DATA.attname2]: DATA.file2
                    }
                });
                DocMeta.updateFixed(doc, body, (err) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT(doc, expected);
                    DOC.EXPECT_EXISTS(doc.id, expected, () => {
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, () => {
                            ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname2, DATA.file2.body, done);
                        });
                    });
                });
            });
            it('updates a document to overwrite an attachment', function(done) {
                const body = new Body(Object.assign({}, DATA.update, {
                    _attachments: {
                        [DATA.attname]: DATA.file2
                    }
                }));
                const expected = BODY.DEEP_EXTEND(doc.body, DATA.update, {
                    _attachments: {
                        [DATA.attname]: DATA.file2
                    }
                });
                DocMeta.updateFixed(doc, body, (err) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT(doc, expected);
                    DOC.EXPECT_EXISTS(doc.id, expected, () => {
                        ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file2.body, done);
                    });
                });
            });
            it('updates a document with new attachment deletes old attachment', function(done) {
                const body = new Body(Object.assign({}, DATA.update, {
                    _attachments: {
                        [DATA.attname]: undefined,
                        [DATA.attname2]: DATA.file2
                    }
                }));
                const expected = Object.assign(BODY.DEEP_EXTEND(doc.body, DATA.update), {
                    _attachments: {
                        [DATA.attname2]: DATA.file2
                    }
                });
                DocMeta.updateFixed(doc, body, (err) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT(doc, expected);
                    DOC.EXPECT_EXISTS(doc.id, expected, () => {
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, () => {
                            ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname2, DATA.file2.body, done);
                        });
                    });
                });
            });
            it('updates a document removing all attachments', function(done) {
                const body = new Body(Object.assign({}, DATA.update, {
                    _attachments: undefined
                }));
                const expected = BODY.DEEP_EXTEND(doc.body, DATA.update, {
                    _attachments: undefined
                });
                DocMeta.updateFixed(doc, body, (err) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT(doc, expected);
                    DOC.EXPECT_EXISTS(doc.id, expected, () => {
                        ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
                    });
                });
            });
        });
    });
});
