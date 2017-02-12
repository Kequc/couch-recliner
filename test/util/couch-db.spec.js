'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const CouchDb = require('../../lib/util/couch-db');

const db = 'http://localhost:5984';
const dbName = 'nano-records-db-test';

describe('CouchDb', function () {
    describe('requestBuilder', function () {
        it('builds a request', function () {
            const req = CouchDb.requestBuilder('GET', [db, dbName]);
            expect(req).to.have.property('method', 'GET');
            expect(req).to.have.property('url', [db, dbName].join('/'));
            expect(req).to.have.property('headers');
        });
    });
});
