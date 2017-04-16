'use strict';
const { expect } = require('chai');

const { FindOperations } = require('../lib');

const DATA = require('./helpers/data-helpers');
const BODY = require('./helpers/body-helpers');
const DB = require('./helpers/db-helpers');
const DOC = require('./helpers/doc-helpers');
const ERR = require('./helpers/err-helpers');

describe('Prime FindOperations', function() {
    let doc;
    let doc2;
    beforeEach(function(done) {
        DB.RESET(() => {
            DOC.CREATE_MULTI((model, model2) => { doc = model; doc2 = model2; done(); });
        });
    });
    describe('findOne', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model, DATA.find2];
            const invalid = [
                [{}, 'hi'],
                [0, 'hi', {}, Object.assign({}, DATA.find2, { limit: 'hi' })]
            ];
            ERR.EXPECT_PARAM_ERRORS(FindOperations.findOne, valid, invalid, done);
        });
        it('WORKS', function(done) {
            FindOperations.findOne(DATA.Model, DATA.find2, (err, doc3) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_ID(doc3, doc.id);
                BODY.EXPECT_REV(doc3, doc.rev);
                BODY.EXPECT_LATEST_REV(doc3, undefined);
                BODY.EXPECT(doc3, BODY.PLUCK(doc.body, DATA.find2));
                done();
            });
        });
    });
    describe('find', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model, DATA.find2];
            const invalid = [
                [{}, 'hi'],
                [0, 'hi', {}, Object.assign({}, DATA.find2, { limit: 'hi' })]
            ];
            ERR.EXPECT_PARAM_ERRORS(FindOperations.find, valid, invalid, done);
        });
        it('WORKS', function(done) {
            FindOperations.find(DATA.Model, DATA.find2, (err, docs) => {
                ERR.EXPECT_NONE(err);
                expect(docs.length).to.equal(2);
                BODY.EXPECT_ID(docs[0], doc.id);
                BODY.EXPECT_REV(docs[0], doc.rev);
                BODY.EXPECT_LATEST_REV(docs[0], undefined);
                BODY.EXPECT(docs[0], BODY.PLUCK(doc.body, DATA.find2));
                BODY.EXPECT_ID(docs[1], doc2.id);
                BODY.EXPECT_REV(docs[1], doc2.rev);
                BODY.EXPECT_LATEST_REV(docs[1], undefined);
                BODY.EXPECT(docs[1], BODY.PLUCK(doc2.body, DATA.find2));
                done();
            });
        });
    });
});
