'use strict';
const expect = require('chai').expect;

const Couch = require('../../lib/models/couch');

const ERR = require('../helpers/err-helpers');

function _EXPECT_GENERATED_ID(id) {
    expect(typeof id).to.equal('string');
    expect(id.length).to.equal(32);
    for (const char of id) {
        expect('0123456789abcfdef').to.contain(char);
    }
}

function _POPULATE_IDS(couch, done) {
    expect(couch._ids.length).to.equal(0);
    couch.getNextId((err, id) => {
        ERR.EXPECT_NONE(err);
        _EXPECT_GENERATED_ID(id);
        expect(couch._ids.length).to.equal(couch.CACHE_IDS_COUNT - 1);
        done();
    });
}

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
            expect(() => couch.envs = undefined).to.throw(Error);
            expect(() => couch.envs = 1).to.throw(Error);
            expect(() => couch.envs = { development: undefined }).to.throw(Error);
            expect(() => couch.envs = { development: 1 }).to.throw(Error);
        });
        it('has a default baseUrl', function() {
            expect(couch.baseUrl).to.not.be.undefined;
        });
        it('can supply a default baseUrl', function() {
            const expected = couch.baseUrl + '-blah';
            couch.envs = {
                any: expected,
                fakeenv: 'http://notthisone.com'
            };
            expect(couch.baseUrl).to.equal(expected);
        });
        it('sets the baseUrl', function() {
            const expected = couch.baseUrl + '-blah';
            const env = process.env.NODE_ENV || 'development';
            couch.envs = {
                fakeenv: 'http://notthisone.com',
                [env]: expected,
                any: 'http://notthisoneeither.com'
            };
            expect(couch.baseUrl).to.equal(expected);
        });
    });
    describe('urlTo', function() {
        it('resolves a path', function() {
            expect(couch.urlTo('hi', 'there', 55, '100')).to.equal(couch.baseUrl + '/hi/there/55/100');
        });
        it('recovers from trailing slash on baseUrl', function() {
            const baseUrl = 'http://testing.com/hello/';
            couch.envs = { any: baseUrl };
            expect(couch.urlTo('hi', 'there', 55, '100')).to.equal(baseUrl + 'hi/there/55/100');
        });
        it('throws an error on invalid data', function() {
            expect(() => couch.urlTo('hi', undefined)).to.throw(Error);
        });
    });
    describe('getNextId', function() {
        it('populates cache', function(done) {
            _POPULATE_IDS(couch, done);
        });
        it('returns ids from cache', function(done) {
            _POPULATE_IDS(couch, () => {
                while (couch._ids.length > 0) {
                    const count = couch._ids.length;
                    couch.getNextId((err, id) => {
                        ERR.EXPECT_NONE(err);
                        _EXPECT_GENERATED_ID(id);
                        expect(couch._ids.length).to.equal(count - 1);
                    });
                }
                _POPULATE_IDS(couch, done);
            });
        });
    });
});
