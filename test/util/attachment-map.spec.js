'use strict';
const { expect } = require('chai');

const Attachment = require('../../lib/models/attachment');
const AttachmentMap = require('../../lib/util/attachment-map');
const DATA = require('../helpers/data-helpers');

describe('Util AttachmentMap', function() {
    describe('extract', function() {
        it('returns a map of attachment instances', function() {
            const result = AttachmentMap.extract({
                [DATA.attname]: DATA.file,
                [DATA.attname2]: DATA.file2
            });
            expect(result).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(result[DATA.attname]).to.be.instanceof(Attachment);
            expect(result[DATA.attname2]).to.be.instanceof(Attachment);
        });
        it('returns undefined when appropriate', function() {
            const result = AttachmentMap.extract({
                [DATA.attname]: DATA.file,
                [DATA.attname2]: undefined
            });
            expect(result).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(result[DATA.attname]).to.be.instanceof(Attachment);
            expect(result[DATA.attname2]).to.be.undefined;
        });
        it('returns attachment instances directly', function() {
            const attachment2 = new Attachment(DATA.file);
            const result = AttachmentMap.extract({
                [DATA.attname]: undefined,
                [DATA.attname2]: attachment2
            });
            expect(result).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(result[DATA.attname]).to.be.undefined;
            expect(result[DATA.attname2]).to.equal(attachment2);
        });
    });
    describe('forDoc', function() {
        it('renders attachments as stubs', function() {
            const attachments = AttachmentMap.extract({
                [DATA.attname]: DATA.file,
                [DATA.attname2]: DATA.file2
            });
            const result = AttachmentMap.forDoc(attachments);
            expect(result).to.have.all.keys(Object.keys(attachments));
            expect(result[DATA.attname]).to.eql(attachments[DATA.attname].toStub());
            expect(result[DATA.attname2]).to.eql(attachments[DATA.attname2].toStub());
        });
    });
    describe('forHttp', function() {
        it('renders attachments for http', function() {
            const attachments = AttachmentMap.extract({
                [DATA.attname]: DATA.file,
                [DATA.attname2]: DATA.fileStub
            });
            const result = AttachmentMap.forHttp(attachments);
            expect(result).to.have.all.keys(Object.keys(attachments));
            expect(result[DATA.attname]).to.eql(attachments[DATA.attname].forHttp());
            expect(result[DATA.attname2]).to.eql(attachments[DATA.attname2].forHttp());
        });
    });
    describe('extend', function() {
        it('adds attachments to _attachments', function() {
            const _attachments = {
                [DATA.attname]: DATA.file
            };
            const attachments = AttachmentMap.extract({
                [DATA.attname2]: DATA.file2
            });
            const result = AttachmentMap.extend(_attachments, attachments);
            expect(result).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(result[DATA.attname]).to.be.instanceof(Attachment);
            expect(result[DATA.attname2]).to.be.instanceof(Attachment);
        });
        it('overwrites attachments in _attachments', function() {
            const _attachments = {
                [DATA.attname]: DATA.file,
                [DATA.attname2]: DATA.file2
            };
            const attachments = AttachmentMap.extract({
                [DATA.attname]: DATA.fileText
            });
            const result = AttachmentMap.extend(_attachments, attachments);
            expect(result).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(result[DATA.attname]).to.be.instanceof(Attachment);
            expect(result[DATA.attname2]).to.be.instanceof(Attachment);
            expect(result[DATA.attname]).to.equal(attachments[DATA.attname]);
        });
        it('removes attachments in _attachments', function() {
            const _attachments = {
                [DATA.attname]: DATA.file,
                [DATA.attname2]: DATA.file2,
                [DATA.attname3]: DATA.fileStub
            };
            const attachments = AttachmentMap.extract({
                [DATA.attname2]: undefined
            });
            const result = AttachmentMap.extend(_attachments, attachments);
            expect(result).to.have.all.keys(DATA.attname, DATA.attname3);
            expect(result[DATA.attname]).to.be.instanceof(Attachment);
            expect(result[DATA.attname3]).to.be.instanceof(Attachment);
        });
    });
    describe('isValid', function() {
        it('returns true on undefined and empty', function() {
            expect(AttachmentMap.isValid(undefined)).to.be.true;
            expect(AttachmentMap.isValid({})).to.be.true;
        });
        it('returns true if all attachments are valid', function() {
            const attachments = AttachmentMap.extract({
                [DATA.attname]: DATA.file,
                [DATA.attname2]: DATA.file2,
                [DATA.attname3]: DATA.fileStub
            });
            expect(AttachmentMap.isValid(attachments)).to.be.true;
        });
        it('returns true if an attachment is undefined', function() {
            const attachments = AttachmentMap.extract({
                [DATA.attname]: DATA.file,
                [DATA.attname2]: undefined,
                [DATA.attname3]: DATA.fileStub
            });
            expect(AttachmentMap.isValid(attachments)).to.be.true;
        });
        it('returns false if an attachment is not valid', function() {
            const attachments = AttachmentMap.extract({
                [DATA.attname]: DATA.file,
                [DATA.attname2]: {},
                [DATA.attname3]: DATA.fileStub
            });
            expect(AttachmentMap.isValid(attachments)).to.be.false;
        });
    });
    describe('forMultipart', function() {
        it('returns array of multipart formatted attachments', function() {
            const attachments = AttachmentMap.extract({
                [DATA.attname]: DATA.file,
                [DATA.attname2]: DATA.file2
            });
            const result = AttachmentMap.forMultipart(attachments);
            expect(result).to.eql([
                attachments[DATA.attname].forMultipart(),
                attachments[DATA.attname2].forMultipart()
            ]);
        });
        it('skips stubs in result', function() {
            const attachments = AttachmentMap.extract({
                [DATA.attname]: DATA.file,
                [DATA.attname2]: DATA.fileStub,
                [DATA.attname3]: DATA.file2
            });
            const result = AttachmentMap.forMultipart(attachments);
            expect(result).to.eql([
                attachments[DATA.attname].forMultipart(),
                attachments[DATA.attname3].forMultipart()
            ]);
        });
    });
});
