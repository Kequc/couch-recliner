'use strict';
const { expect } = require('chai');

const Couch = require('../../lib/models/couch');

describe('Models Couch', function() {
    let couch;
    beforeEach(function() {
        couch = new Couch();
    });
    describe('CACHE_IDS_COUNT =', function() {
        it('throws an error on invalid data', function() {
            expect(() => couch.CACHE_IDS_COUNT = {}).to.throw(Error);
            expect(() => couch.CACHE_IDS_COUNT = undefined).to.throw(Error);
        });
        it('has a default', function() {
            expect(couch.CACHE_IDS_COUNT).to.not.be.undefined;
        });
        it('sets the value', function() {
            const expected = couch.CACHE_IDS_COUNT + 1;
            couch.CACHE_IDS_COUNT = expected;
            expect(couch.CACHE_IDS_COUNT).to.equal(expected);
        });
    });
    describe('envs =', function() {
        it('throws an error on invalid data', function() {
            expect(() => couch.envs = 1).to.throw(Error);
            expect(() => couch.envs = { url: 'ftp://google.com' }).to.throw(Error);
            expect(() => couch.envs = { url: 'google.com' }).to.throw(Error);
            expect(() => couch.envs = { url: 1 }).to.throw(Error);
        });
        it('has a default baseUrl', function() {
            expect(couch.baseUrl).to.not.be.undefined;
        });
        it('can supply a baseUrl from string', function() {
            const expected = couch.baseUrl + '-blah';
            couch.envs = expected;
            expect(couch.baseUrl).to.equal(expected);
        });
        it('can supply a baseUrl from object', function() {
            const expected = couch.baseUrl + '-blah';
            couch.envs = { url: expected };
            expect(couch.baseUrl).to.equal(expected);
        });
    });
    describe('urlTo', function() {
        it('resolves a path', function() {
            expect(couch.urlTo('hi', 'there', 55, '100')).to.equal(couch.baseUrl + '/hi/there/55/100');
        });
        it('recovers from trailing slash on baseUrl', function() {
            const baseUrl = 'http://testing.com/hello/';
            couch.envs = baseUrl;
            expect(couch.urlTo('hi', 'there', 55, '100')).to.equal(baseUrl + 'hi/there/55/100');
        });
        it('throws an error on invalid data', function() {
            expect(() => couch.urlTo('hi', undefined)).to.throw(Error);
        });
    });
});
