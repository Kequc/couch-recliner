'use strict';
const { AttachmentOperations } = require('../lib');

const ATTACHMENT = require('./helpers/attachment-helpers');
const DATA = require('./helpers/data-helpers');
const DB = require('./helpers/db-helpers');
const DOC = require('./helpers/doc-helpers');
const ERR = require('./helpers/err-helpers');

describe('Prime AttachmentOperations', function() {
    let doc;
    beforeEach(function(done) {
        DB.RESET(() => {
            DOC.CREATE_WITH_ATTACHMENT((model) => { doc = model; done(); });
        });
    });
    describe('readFixed', function() {
        it('returns error on invalid params', function(done) {
            const valid = [doc, DATA.attname];
            const invalid = [
                [{}, 'hi'],
                [0]
            ];
            ERR.EXPECT_PARAM_ERRORS(AttachmentOperations.readFixed, valid, invalid, done);
        });
        it('WORKS', function(done) {
            AttachmentOperations.readFixed(doc, DATA.attname, (err, buffer) => {
                ERR.EXPECT_NONE(err);
                ATTACHMENT.EXPECT(buffer, DATA.file.body);
                ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, done);
            });
        });
    });
    describe('read', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model, doc.id, DATA.attname];
            const invalid = [
                [{}, 'hi'],
                [0],
                [0]
            ];
            ERR.EXPECT_PARAM_ERRORS(AttachmentOperations.read, valid, invalid, done);
        });
        it('WORKS', function(done) {
            AttachmentOperations.read(DATA.Model, doc.id, DATA.attname, (err, buffer) => {
                ERR.EXPECT_NONE(err);
                ATTACHMENT.EXPECT(buffer, DATA.file.body);
                ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file.body, done);
            });
        });
    });
    describe('writeFixed', function() {
        it('returns error on invalid params', function(done) {
            const valid = [doc, DATA.attname, DATA.file2];
            const invalid = [
                [{}, 'hi'],
                [0],
                [{}, 0]
            ];
            ERR.EXPECT_PARAM_ERRORS(AttachmentOperations.writeFixed, valid, invalid, done);
        });
        it('WORKS', function(done) {
            AttachmentOperations.writeFixed(doc, DATA.attname, DATA.file2, (err, buffer) => {
                ERR.EXPECT_NONE(err);
                ATTACHMENT.EXPECT(buffer, DATA.file2.body);
                ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file2.body, done);
            });
        });
    });
    describe('write', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model, doc.id, DATA.attname, DATA.file2];
            const invalid = [
                [{}, 'hi'],
                [0],
                [0],
                [{}, 0]
            ];
            ERR.EXPECT_PARAM_ERRORS(AttachmentOperations.write, valid, invalid, done);
        });
        it('WORKS', function(done) {
            AttachmentOperations.write(DATA.Model, doc.id, DATA.attname, DATA.file2, (err, buffer) => {
                ERR.EXPECT_NONE(err);
                ATTACHMENT.EXPECT(buffer, DATA.file2.body);
                ATTACHMENT.EXPECT_EXISTS(doc.id, DATA.attname, DATA.file2.body, done);
            });
        });
    });
    describe('destroyFixed', function() {
        it('returns error on invalid params', function(done) {
            const valid = [doc, DATA.attname];
            const invalid = [
                [{}, 'hi'],
                [0]
            ];
            ERR.EXPECT_PARAM_ERRORS(AttachmentOperations.destroyFixed, valid, invalid, done);
        });
        it('WORKS', function(done) {
            AttachmentOperations.destroyFixed(doc, DATA.attname, (err) => {
                ERR.EXPECT_NONE(err);
                ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
            });
        });
    });
    describe('destroy', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model, doc.id, DATA.attname];
            const invalid = [
                [{}, 'hi'],
                [0],
                [0]
            ];
            ERR.EXPECT_PARAM_ERRORS(AttachmentOperations.destroy, valid, invalid, done);
        });
        it('WORKS', function(done) {
            AttachmentOperations.destroy(DATA.Model, doc.id, DATA.attname, (err) => {
                ERR.EXPECT_NONE(err);
                ATTACHMENT.EXPECT_DOES_NOT_EXIST(doc.id, DATA.attname, done);
            });
        });
    });
});
