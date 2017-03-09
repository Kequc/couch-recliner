'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const CouchDb = require('../../../lib/util/couch-db');

const etag = 'ahahahjahjhalhlkahlkhalkhlkahlk';
const response = {
    etag: '"' + etag + '"'
};

describe('CouchDb getRev', function () {
    it('returns no rev on no rev available', function () {
        const rev = CouchDb.getRev({}, {});
        expect(rev).to.be.undefined;
    });
    it('returns a rev provided by the response', function () {
        const rev = CouchDb.getRev(response, {});
        expect(rev).to.equal(etag);
    });
    it('returns a rev provided by body', function () {
        const rev = CouchDb.getRev({}, { rev: etag });
        expect(rev).to.equal(etag);
    });
    it('returns a rev provided by the document body', function () {
        const rev = CouchDb.getRev({}, { _rev: etag });
        expect(rev).to.equal(etag);
    });
    it('prefers rev provided by the body', function () {
        const rev = CouchDb.getRev({ etag: '"no"' }, { rev: etag });
        expect(rev).to.equal(etag);
    });
    it('prefers rev provided by the document body', function () {
        const rev = CouchDb.getRev({ etag: '"no"' }, { _rev: etag });
        expect(rev).to.equal(etag);
    });
});
