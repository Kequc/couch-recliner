'use strict';
const { expect } = require('chai');

const Attachment = require('../../lib/models/attachment');
const AttachmentMap = require('../../lib/util/attachment-map');
const DATA = require('../helpers/data-helpers');

describe('Util AttachmentMap', function() {
    describe('isValid', function() {
        it('returns true on undefined and empty', function() {
            expect(AttachmentMap.isValid(undefined)).to.be.true;
            expect(AttachmentMap.isValid({})).to.be.true;
        });
        it('returns true if all attachments are valid', function() {
            const attachments = {
                [DATA.attname]: DATA.file,
                [DATA.attname2]: DATA.file2,
                [DATA.attname3]: DATA.fileStub
            };
            expect(AttachmentMap.isValid(attachments)).to.be.true;
        });
        it('returns true if an attachment is undefined', function() {
            const attachments = {
                [DATA.attname]: DATA.file,
                [DATA.attname2]: undefined,
                [DATA.attname3]: DATA.fileStub
            };
            expect(AttachmentMap.isValid(attachments)).to.be.true;
        });
        it('returns false if an attachment is not valid', function() {
            const attachments = {
                [DATA.attname]: DATA.file,
                [DATA.attname2]: {},
                [DATA.attname3]: DATA.fileStub
            };
            expect(AttachmentMap.isValid(attachments)).to.be.false;
        });
    });
    describe('forDoc', function() {
        it('renders attachments as stubs', function() {
            const attachments = {
                [DATA.attname]: DATA.file,
                [DATA.attname2]: DATA.file2
            };
            const result = AttachmentMap.forDoc(attachments);
            expect(result).to.have.all.keys(Object.keys(attachments));
            expect(result[DATA.attname]).to.eql(new Attachment(attachments[DATA.attname]).toStub());
            expect(result[DATA.attname2]).to.eql(new Attachment(attachments[DATA.attname2]).toStub());
        });
    });
    describe('forHttp', function() {
        it('renders attachments for http', function() {
            const attachments = {
                [DATA.attname]: DATA.file,
                [DATA.attname2]: DATA.fileStub
            };
            const result = AttachmentMap.forHttp(attachments);
            expect(result).to.have.all.keys(Object.keys(attachments));
            expect(result[DATA.attname]).to.eql(new Attachment(attachments[DATA.attname]).forHttp());
            expect(result[DATA.attname2]).to.eql(new Attachment(attachments[DATA.attname2]).forHttp());
        });
    });
    describe('forMultipart', function() {
        it('returns array of multipart formatted attachments', function() {
            const attachments = {
                [DATA.attname]: DATA.file,
                [DATA.attname2]: DATA.file2
            };
            const result = AttachmentMap.forMultipart(attachments);
            expect(result).to.eql([
                new Attachment(attachments[DATA.attname]).forMultipart(),
                new Attachment(attachments[DATA.attname2]).forMultipart()
            ]);
        });
        it('skips stubs in result', function() {
            const attachments = {
                [DATA.attname]: DATA.file,
                [DATA.attname2]: DATA.fileStub,
                [DATA.attname3]: DATA.file2
            };
            const result = AttachmentMap.forMultipart(attachments);
            expect(result).to.eql([
                new Attachment(attachments[DATA.attname]).forMultipart(),
                new Attachment(attachments[DATA.attname3]).forMultipart()
            ]);
        });
    });
});
