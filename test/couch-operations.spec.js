'use strict';
const { expect } = require('chai');

const { Couch, CouchOperations } = require('../lib');

const BODY = require('./helpers/body-helpers');
const DB = require('./helpers/db-helpers');
const ERR = require('./helpers/err-helpers');

describe('Prime CouchOperations', function() {
    beforeEach(DB.DESTROY);
    describe('uuids', function() {
        it('returns error on invalid params', function(done) {
            const valid = [new Couch(), 50];
            const invalid = [
                [{}, 'hi'],
                [0, 'hi']
            ];
            ERR.EXPECT_PARAM_ERRORS(CouchOperations.uuids, valid, invalid, done);
        });
        it('WORKS', function(done) {
            const count = 50;
            CouchOperations.uuids(new Couch(), count, (err, ids) => {
                ERR.EXPECT_NONE(err);
                expect(ids.length).to.equal(count);
                for (const id of ids) {
                    BODY.EXPECT_GENERATED_ID(id);
                }
                done();
            });
        });
    });
});
