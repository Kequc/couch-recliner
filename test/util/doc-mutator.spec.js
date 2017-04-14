'use strict';
const expect = require('chai').expect;

const DocMutator = require('../../lib/util/doc-mutator');
const Attachment = require('../../lib/models/attachment');
const Body = require('../../lib/models/body');

const BODY = require('../helpers/body-helpers');
const DATA = require('../helpers/data-helpers');

describe('Util DocMutator', function() {
    describe('build', function() {
        it('creates a new instance with data', function() {
            const result = DocMutator.build(DATA.Model, DATA.doc, DATA.id, DATA.rev, DATA.rev);
            expect(result).to.be.instanceOf(DATA.Model);
            BODY.EXPECT_ID(result, DATA.id);
            BODY.EXPECT(result, DATA.doc);
            BODY.EXPECT_REV(result, DATA.rev);
            BODY.EXPECT_LATEST_REV(result, DATA.rev);
        });
        it('creates a new instance without latestRev', function() {
            const result = DocMutator.build(DATA.Model, DATA.doc, DATA.id, DATA.rev, undefined);
            expect(result).to.be.instanceOf(DATA.Model);
            BODY.EXPECT_ID(result, DATA.id);
            BODY.EXPECT(result, DATA.doc);
            BODY.EXPECT_REV(result, DATA.rev);
            BODY.EXPECT_LATEST_REV(result, undefined);
        });
        it('accepts body instance as property', function() {
            const body = Body.create(DATA.doc);
            const result = DocMutator.build(DATA.Model, body, DATA.id, DATA.rev, undefined);
            expect(result).to.be.instanceOf(DATA.Model);
            BODY.EXPECT_ID(result, DATA.id);
            BODY.EXPECT(result, body.forDoc());
            BODY.EXPECT_REV(result, DATA.rev);
            BODY.EXPECT_LATEST_REV(result, undefined);
        });
    });
    describe('update', function() {
        it('updates the document', function() {
            const doc = DATA.GENERATE_FAKE_DOC();
            const oldId = doc.id;
            DocMutator.update(doc, DATA.doc2, DATA.rev2, DATA.rev3);
            BODY.EXPECT_ID(doc, oldId);
            BODY.EXPECT(doc, DATA.doc2);
            BODY.EXPECT_REV(doc, DATA.rev2);
            BODY.EXPECT_LATEST_REV(doc, DATA.rev3);
        });
        it('accepts body instance as property', function() {
            const doc = DATA.GENERATE_FAKE_DOC();
            const oldId = doc.id;
            const body = Body.create(DATA.doc2);
            DocMutator.update(doc, body, DATA.rev2, DATA.rev3);
            BODY.EXPECT_ID(doc, oldId);
            BODY.EXPECT(doc, DATA.doc2);
            BODY.EXPECT_REV(doc, DATA.rev2);
            BODY.EXPECT_LATEST_REV(doc, DATA.rev3);
        });
    });
    describe('erase', function() {
        it('erases the document', function() {
            const doc = DATA.GENERATE_FAKE_DOC();
            DocMutator.erase(doc);
            BODY.EXPECT_ID(doc, undefined);
            BODY.EXPECT(doc, {});
            BODY.EXPECT_REV(doc, undefined);
            BODY.EXPECT_LATEST_REV(doc, undefined);
        });
    });
    describe('updateAttachment', function() {
        it('adds an attachment to document', function() {
            const doc = DATA.GENERATE_FAKE_DOC();
            const oldId = doc.id;
            const oldRev = doc.rev;
            const attachment = new Attachment(DATA.file);
            DocMutator.updateAttachment(doc, DATA.attname, attachment, DATA.rev2);
            BODY.EXPECT_ID(doc, oldId);
            BODY.EXPECT(doc, Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: attachment.toStub()
                }
            }));
            BODY.EXPECT_REV(doc, oldRev);
            BODY.EXPECT_LATEST_REV(doc, DATA.rev2);
        });
        it('updates existing attachment', function() {
            const body = Body.create(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.file2
                }
            }));
            const doc = DocMutator.build(DATA.Model, body, DATA.id, DATA.rev, DATA.rev);
            const attachment = new Attachment(DATA.fileText);
            DocMutator.updateAttachment(doc, DATA.attname, attachment, DATA.rev2);
            BODY.EXPECT_ID(doc, DATA.id);
            BODY.EXPECT(doc, Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: attachment.toStub(),
                    [DATA.attname2]: body.attachments[DATA.attname2].toStub()
                }
            }));
            BODY.EXPECT_REV(doc, DATA.rev);
            BODY.EXPECT_LATEST_REV(doc, DATA.rev2);
        });
    });
    describe('eraseAttachment', function() {
        it('removes existing attachment', function() {
            const body = Body.create(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.file2
                }
            }));
            const doc = DocMutator.build(DATA.Model, body, DATA.id, DATA.rev, DATA.rev);
            DocMutator.eraseAttachment(doc, DATA.attname, DATA.rev2);
            BODY.EXPECT_ID(doc, DATA.id);
            BODY.EXPECT(doc, Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname2]: body.attachments[DATA.attname2].toStub()
                }
            }));
            BODY.EXPECT_REV(doc, DATA.rev);
            BODY.EXPECT_LATEST_REV(doc, DATA.rev2);
        });
    });
    describe('updateLatestRev', function() {
        it('updates latestRev', function() {
            const doc = DATA.GENERATE_FAKE_DOC();
            const oldId = doc.id;
            const oldRev = doc.rev;
            DocMutator.updateLatestRev(doc, DATA.rev2);
            BODY.EXPECT_ID(doc, oldId);
            BODY.EXPECT_REV(doc, oldRev);
            BODY.EXPECT_LATEST_REV(doc, DATA.rev2);
        });
    });
    describe('eraseLatestRev', function() {
        it('sets latestRev undefined', function() {
            const doc = DATA.GENERATE_FAKE_DOC();
            const oldId = doc.id;
            const oldRev = doc.rev;
            DocMutator.eraseLatestRev(doc);
            BODY.EXPECT_ID(doc, oldId);
            BODY.EXPECT_REV(doc, oldRev);
            BODY.EXPECT_LATEST_REV(doc, undefined);
        });
    });
});
