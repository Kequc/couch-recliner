'use strict';
const { expect } = require('chai');

const CouchMeta = require('../../lib/meta/couch-meta');

const ERR = require('./err-helpers');
const BODY = require('./body-helpers');

const COUCH = {};

COUCH.POPULATE_IDS = (couch, done) => {
    expect(couch._ids.length).to.equal(0);
    CouchMeta.nextId(couch, (err, id) => {
        ERR.EXPECT_NONE(err);
        BODY.EXPECT_GENERATED_ID(id);
        expect(couch._ids.length).to.equal(couch.CACHE_IDS_COUNT - 1);
        done();
    });
};

module.exports = COUCH;
