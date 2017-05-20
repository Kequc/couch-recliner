'use strict';
const { expect } = require('chai');

const { Couch, CouchOperations } = require('../lib');

const BODY = require('./helpers/body-helpers');
const DB = require('./helpers/db-helpers');
const ERR = require('./helpers/err-helpers');

describe('Prime CouchOperations', function() {
    beforeEach(DB.DESTROY);
    describe('nextId', function() {
        it('returns error on invalid params', function(done) {
            const valid = [new Couch()];
            const invalid = [
                [{}, 'hi']
            ];
            ERR.EXPECT_PARAM_ERRORS(CouchOperations.nextId, valid, invalid, done);
        });
        it('WORKS', function(done) {
            CouchOperations.nextId(new Couch(), (err, id) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_GENERATED_ID(id);
                done();
            });
        });
    });
});
