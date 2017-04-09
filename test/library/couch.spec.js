'use strict';
const expect = require('chai').expect;

const Couch = require('../../lib/couch');

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

describe('Couch', function() {
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
    describe('url =', function() {
        it('throws an error on invalid data', function() {
            expect(() => couch.url = {}).to.throw(Error);
            expect(() => couch.url = 1).to.throw(Error);
        });
        it('has a default', function() {
            expect(couch.url).to.not.be.undefined;
        });
        it('sets the value', function() {
            const expected = couch.url + '-blah';
            couch.url = expected;
            expect(couch.url).to.equal(expected);
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
