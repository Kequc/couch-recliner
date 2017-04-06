'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const Couch = require('../../lib/couch');
const Helpers = require('../Helpers');

function _populateIds(couch, done) {
    expect(couch._ids.length).to.equal(0);
    couch.getNextId((err, id) => {
        Helpers.EXPECT_NO_ERROR(err);
        Helpers.EXPECT_VALID_ID(id);
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
            _populateIds(couch, done);
        });
        it('returns ids from cache', function(done) {
            _populateIds(couch, () => {
                while (couch._ids.length > 0) {
                    const count = couch._ids.length;
                    couch.getNextId((err, id) => {
                        Helpers.EXPECT_NO_ERROR(err);
                        Helpers.EXPECT_VALID_ID(id);
                        expect(couch._ids.length).to.equal(count - 1);
                    });
                }
                _populateIds(couch, done);
            });
        });
    });
});
