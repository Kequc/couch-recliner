'use strict';
const expect = require('chai').expect;

const AttachmentMeta = require('../../lib/meta/attachment-meta');

const DATA = require('./data-helpers');
const ERR = require('./err-helpers');

const ATTACHMENT = {};

ATTACHMENT.EXPECT_DOES_NOT_EXIST = (id, attname, done) => {
    AttachmentMeta.read(DATA.Model, id, attname, (err) => {
        ERR.EXPECT(err, 'not_found');
        done();
    });
};

ATTACHMENT.EXPECT_EXISTS = (id, attname, buffer, done) => {
    AttachmentMeta.read(DATA.Model, id, attname, (err, body) => {
        ERR.EXPECT_NONE(err);
        ATTACHMENT.EXPECT(body, buffer);
        done();
    });
};

ATTACHMENT.EXPECT = (buffer, buffer2) => {
    const body = String.fromCharCode(null, buffer);
    const body2 = String.fromCharCode(null, buffer2);
    expect(body).to.eql(body2);
};

module.exports = ATTACHMENT;
