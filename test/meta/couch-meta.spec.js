'use strict';
const { expect } = require('chai');

const CouchMeta = require('../../lib/meta/couch-meta');
const Couch = require('../../lib/models/couch');

const BODY = require('../helpers/body-helpers');
const COUCH = require('../helpers/couch-helpers');
const DB = require('../helpers/db-helpers');
const ERR = require('../helpers/err-helpers');

describe('Meta CouchMeta', function() {
    beforeEach(DB.DESTROY);
    describe('database does not exist', function() {
        it('nextId', function(done) {
            const couch = new Couch();
            COUCH.POPULATE_IDS(couch, () => {
                expect(couch._ids.length).to.be.gt(0);
                while (couch._ids.length > 0) {
                    const count = couch._ids.length;
                    CouchMeta.nextId(couch, (err, id) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_GENERATED_ID(id);
                        expect(couch._ids.length).to.equal(count - 1);
                    });
                }
                COUCH.POPULATE_IDS(couch, done);
            });
        });
    });
    describe('database exists', function() {
        beforeEach(DB.CREATE);
        it('nextId', function(done) {
            const couch = new Couch();
            COUCH.POPULATE_IDS(couch, () => {
                expect(couch._ids.length).to.be.gt(0);
                while (couch._ids.length > 0) {
                    const count = couch._ids.length;
                    CouchMeta.nextId(couch, (err, id) => {
                        ERR.EXPECT_NONE(err);
                        BODY.EXPECT_GENERATED_ID(id);
                        expect(couch._ids.length).to.equal(count - 1);
                    });
                }
                COUCH.POPULATE_IDS(couch, done);
            });
        });
    });
});
