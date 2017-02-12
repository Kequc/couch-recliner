'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const CouchDb = require('../../../lib/util/couch-db');

const error = new Error('This is an error');
error.statusCode = 409;
const response = {
    statusCode: 404
};
const body = {
    message: 'Invalid request',
    name: 'ERRORROR',
    statusCode: 500
};

describe('CouchDb getError', function () {
    it('returns an error from error', function () {
        const err = CouchDb.getError(error, response, body);
        expect(err).to.equal(error);
    });
    it('returns an error from response', function () {
        const err = CouchDb.getError(undefined, response, body);
        expect(err).to.not.be.undefined;
        expect(err.statusCode).to.equal(response.statusCode);
    });
    it('returns an error from body', function () {
        const err = CouchDb.getError(undefined, {}, body);
        expect(err).to.not.be.undefined;
        expect(err.statusCode).to.equal(body.statusCode);
    });
});
