'use strict';
const { expect } = require('chai');

const Attachment = require('../../lib/models/attachment');
const DATA = require('../helpers/data-helpers');

describe('Models Attachment', function() {
    describe('constructor', function() {
        it('instantiates with some properties', function() {
            const data = {
                stub: true,
                content_type: 'text/html',
                body: 'Hello',
                length: 50,
                what: 'is this'
            };
            const result = new Attachment(data);
            expect(result.stub).to.equal(data.stub);
            expect(result.type).to.equal(data.content_type);
            expect(result.body).to.equal(data.body);
            expect(result._length).to.equal(data.length);
            expect(result.what).to.equal(undefined);
        });
        it('instantiates with undefined', function() {
            const result = new Attachment(undefined);
            expect(result.stub).to.equal(undefined);
            expect(result.type).to.equal(undefined);
            expect(result.body).to.equal(undefined);
            expect(result._length).to.equal(undefined);
        });
        it('instantiates with invalid data', function() {
            const result = new Attachment(11);
            expect(result.stub).to.equal(undefined);
            expect(result.type).to.equal(undefined);
            expect(result.body).to.equal(undefined);
            expect(result._length).to.equal(undefined);
        });
        it('instantiates with different content-type keys', function() {
            const validKeys = ['CONTENT_TYPE', 'conTenttypE', 'content_type', 'Content-Type'];
            const contentType = 'text/html';
            for (const key of validKeys) {
                const result = new Attachment({ [key]: contentType });
                expect(result.type).to.equal(contentType);
            }
        });
    });
    describe('isValid', function() {
        it('returns true on valid data', function() {
            expect(new Attachment(DATA.file).isValid()).to.be.true;
        });
        it('returns false if type is invalid', function() {
            const data = Object.assign({}, DATA.file, { content_type: 11 });
            expect(new Attachment(data).isValid()).to.be.false;
            const data2 = Object.assign({}, DATA.file);
            delete data2.content_type;
            expect(new Attachment(data2).isValid()).to.be.false;
        });
        it('returns false on invalid length', function() {
            const data = { content_type: 'text/html', body: 'valid' };
            expect(new Attachment(data).isValid()).to.be.true;
            const data2 = { content_type: 'text/html', body: 'valid', length: 'oops' };
            expect(new Attachment(data2).isValid()).to.be.false;
            const data3 = { content_type: 'text/html', body: 'valid', length: 500 };
            expect(new Attachment(data3).isValid()).to.be.true;
            const data4 = { content_type: 'text/html', stub: true, length: 'oops' };
            expect(new Attachment(data4).isValid()).to.be.false;
        });
        it('returns true if is stub', function() {
            const data = { content_type: 'text/html' };
            expect(new Attachment(data).isValid()).to.be.false;
            const data2 = { content_type: 'text/html', stub: true };
            expect(new Attachment(data2).isValid()).to.be.true;
        });
        it('returns true if body is a string', function() {
            const data = { content_type: 'text/html', body: 11 };
            expect(new Attachment(data).isValid()).to.be.false;
            const data2 = { content_type: 'text/html', body: 'Hi!' };
            expect(new Attachment(data2).isValid()).to.be.true;
        });
        it('returns true if body is a buffer', function() {
            const data = { content_type: 'text/html', body: function() {} };
            expect(new Attachment(data).isValid()).to.be.false;
            const data2 = { content_type: 'text/html', body: DATA.file.body };
            expect(new Attachment(data2).isValid()).to.be.true;
        });
    });
    describe('getLength', function() {
        it('returns length if defined', function() {
            expect(new Attachment({ length: 20 }).getLength()).to.equal(20);
            expect(new Attachment({ length: 100 }).getLength()).to.equal(100);
            expect(new Attachment({ length: 0 }).getLength()).to.equal(0);
        });
        it('calculates string length', function() {
            expect(new Attachment({ body: 'My text' }).getLength()).to.equal(7);
            expect(new Attachment({ body: 'Longer text' }).getLength()).to.equal(11);
            expect(new Attachment({ body: '' }).getLength()).to.equal(0);
        });
        it('returns buffer length', function() {
            expect(new Attachment({ body: DATA.file.body }).getLength()).to.equal(DATA.file.body.length);
            expect(new Attachment({ body: DATA.file2.body }).getLength()).to.equal(DATA.file2.body.length);
        });
        it('returns 0 as default', function() {
            expect(new Attachment({}).getLength()).to.equal(0);
            expect(new Attachment({ body: 11 }).getLength()).to.equal(0);
        });
    });
    describe('forHttp', function() {
        it('returns stub formatted if is stub', function() {
            const attachment = new Attachment(DATA.fileStub);
            expect(attachment.forHttp()).to.eql(attachment.toStub());
        });
        it('returns follows formatted if not stub', function() {
            const attachment = new Attachment(DATA.file);
            expect(attachment.forHttp()).to.eql(attachment.toFollows());
        });
    });
    describe('toStub', function() {
        it('returns attachment formatted as stub', function() {
            for (const data of [DATA.file, DATA.file2, DATA.fileText, DATA.fileStub]) {
                const attachment = new Attachment(data);
                expect(attachment.toStub()).to.eql({
                    stub: true,
                    content_type: attachment.type,
                    length: attachment.getLength()
                });
            }
        });
    });
    describe('toFollows', function() {
        it('returns attachment formatted as follows', function() {
            for (const data of [DATA.file, DATA.file2, DATA.fileText, DATA.fileStub]) {
                const attachment = new Attachment(data);
                expect(attachment.toFollows()).to.eql({
                    follows: true,
                    content_type: attachment.type,
                    length: attachment.getLength()
                });
            }
        });
    });
    describe('forMultipart', function() {
        it('returns attachment formatted for multipart', function() {
            for (const data of [DATA.file, DATA.file2, DATA.fileText, DATA.fileStub]) {
                const attachment = new Attachment(data);
                expect(attachment.forMultipart()).to.eql({
                    'content-type': attachment.type,
                    body: attachment.body
                });
            }
        });
    });
});
