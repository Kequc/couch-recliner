'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const CouchDb = require('../../../lib/util/couch-db');

const db = 'http://localhost:5984';
const dbName = 'nano-records-db-test';
const id = 'fahfhaj-lfh11sajhfkundefinedjlahfjlkahfjashlkf';
const headers = {
    'content-type': 'application/json',
    accept: 'application/json'
};
const attachment = {
    name: 'test.text',
    contentType: 'text',
    data: 'Test attachment in a text file.'
};
const body = {
    test: 'content',
    number: 11,
    deep: {
        hello: 'again',
        array: ['thus', 1, 'cat']
    }
};

describe('CouchDb requestBuilder', function () {
    it('builds a GET request', function () {
        const req = CouchDb.requestBuilder('GET', [db, dbName]);
        expect(req).to.have.property('method', 'GET');
        expect(req).to.have.property('url', [db, dbName].join('/'));
        expect(req).to.have.property('headers').to.deep.equal(headers);
    });
    it('builds request with escaped query parameters', function () {
        const req = CouchDb.requestBuilder('GET', [db, dbName], { qs: { hello: 'th ere' } });
        expect(req).to.have.property('url', [db, dbName].join('/'));
        expect(req).to.not.have.property('qs', { hello: 'th ere'});
    });
    it('specifically strinigifies qs values', function () {
        for (const key of ['startkey', 'endkey', 'key', 'keys']) {
            const qs = {};
            qs[key] = ['test', 'again'];
            const req = CouchDb.requestBuilder('GET', [db, dbName], { qs });
            expect(req).to.have.property('qs');
            expect(req).to.have.deep.property('qs.' + key, JSON.stringify(qs[key]));
        }
    });
    it('does not break on user enterable values', function () {
        const opt = {
            startKey: 11,
            endKey: null,
            key: undefined,
            keys: '11',
            qs: [11]
        };
        const req = CouchDb.requestBuilder('GET', [undefined, undefined], opt);
        expect(req).to.have.property('method', 'GET');
    });
    it('ignores attachments and body on GET requests', function () {
        const req = CouchDb.requestBuilder('GET', [db, dbName], { attachments: [attachment], body });
        expect(req).to.have.property('url', [db, dbName].join('/'));
        expect(req).to.not.have.property('json');
        expect(req).to.not.have.property('attachments');
    });
    it('builds a PUT request', function () {
        const req = CouchDb.requestBuilder('PUT', [db, dbName, id]);
        expect(req).to.have.property('method', 'PUT');
        expect(req).to.have.property('url', [db, dbName, id].join('/'));
        expect(req).to.have.property('headers');
    });
    it('adds body to PUT requests', function () {
        const req = CouchDb.requestBuilder('PUT', [db, dbName, id], { body });
        expect(req).to.have.property('method', 'PUT');
        expect(req).to.have.property('url', [db, dbName, id].join('/'));
        expect(req).to.have.property('json').to.deep.equal(body);
    });
    it('does not break on badly formatted body', function () {
        const badBody = {
            func: function () {
                return 'oops';
            }
        };
        badBody.loop = badBody;
        const req = CouchDb.requestBuilder('PUT', [db, dbName, id], { body: badBody });
        expect(req).to.have.property('method', 'PUT');
    });
    it('adds attachments via multipart', function () {
        const req = CouchDb.requestBuilder('PUT', [db, dbName, id], { body, attachments: [attachment] });
        expect(req).to.have.property('method', 'PUT');
        expect(req).to.have.property('url', [db, dbName, id].join('/'));
        expect(req).to.have.property('headers').to.deep.equal({
            'content-type': 'multipart/related',
            accept: 'application/json'
        });
        expect(req).to.have.property('multipart');
        expect(req.multipart).to.have.length(2);
        expect(req.multipart[0]).to.have.property('content-type', 'application/json');
        expect(req.multipart[0]).to.have.property('body');
        const expected = {};
        expected[attachment.name] = {
            follows: true,
            length: attachment.data.length,
            content_type: attachment.contentType
        };
        expect(JSON.parse(req.multipart[0].body)).to.have.property('_attachments').to.deep.equal(expected);
        expect(req.multipart[1]).to.have.property('body', attachment.data);
    });
    it('keeps existing attachments', function () {
        const att = { length: 2, content_type: 'cat', stub: true };
        const bodyWithAtt = Object.assign({ _attachments: { att } }, body);
        const req = CouchDb.requestBuilder('PUT', [db, dbName, id], { body: bodyWithAtt });
        expect(req).to.have.property('json').to.deep.equal(bodyWithAtt);
    });
    it('extends existing attachments', function () {
        const att = { length: 2, content_type: 'cat', stub: true };
        const bodyWithAtt = Object.assign({ _attachments: { att } }, body);
        const req = CouchDb.requestBuilder('PUT', [db, dbName, id], { body: bodyWithAtt, attachments: [attachment] });
        expect(req).to.have.property('multipart');
        expect(req.multipart).to.have.length(2);
        expect(req.multipart[0]).to.have.property('content-type', 'application/json');
        expect(req.multipart[0]).to.have.property('body');
        const expected = { att };
        expected[attachment.name] = {
            follows: true,
            length: attachment.data.length,
            content_type: attachment.contentType
        };
        expect(JSON.parse(req.multipart[0].body)).to.have.property('_attachments').to.deep.equal(expected);
        expect(req.multipart[1]).to.have.property('body', attachment.data);
    });
});
