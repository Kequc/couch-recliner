'use strict';
const { DbOperations } = require('../lib');

const DATA = require('./helpers/data-helpers');
const DB = require('./helpers/db-helpers');
const ERR = require('./helpers/err-helpers');

describe('Prime DbOperations', function() {
    beforeEach(DB.RESET);
    describe('head', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model];
            const invalid = [
                [{}, 'hi']
            ];
            ERR.EXPECT_PARAM_ERRORS(DbOperations.head, valid, invalid, done);
        });
        it('WORKS', function(done) {
            DbOperations.head(DATA.Model, (err) => {
                ERR.EXPECT_NONE(err);
                DB.EXPECT_EXISTS(done);
            });
        });
    });
    describe('reset', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model, '_RESET_'];
            const invalid = [
                [{}, 'hi'],
                [0, 'hi']
            ];
            ERR.EXPECT_PARAM_ERRORS(DbOperations.reset, valid, invalid, done);
        });
        it('WORKS', function(done) {
            DbOperations.reset(DATA.Model, '_RESET_', (err) => {
                ERR.EXPECT_NONE(err);
                DB.EXPECT_EXISTS(done);
            });
        });
    });
    describe('destroy', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model, '_DESTROY_'];
            const invalid = [
                [{}, 'hi'],
                [0, 'hi']
            ];
            ERR.EXPECT_PARAM_ERRORS(DbOperations.destroy, valid, invalid, done);
        });
        it('WORKS', function(done) {
            DbOperations.destroy(DATA.Model, '_DESTROY_', (err) => {
                ERR.EXPECT_NONE(err);
                DB.EXPECT_DOES_NOT_EXIST(done);
            });
        });
    });
    describe('create', function() {
        it('returns error on invalid params', function(done) {
            const valid = [DATA.Model];
            const invalid = [
                [{}, 'hi']
            ];
            ERR.EXPECT_PARAM_ERRORS(DbOperations.create, valid, invalid, done);
        });
        it('WORKS', function(done) {
            DbOperations.create(DATA.Model, (err) => {
                ERR.EXPECT_NONE(err);
                DB.EXPECT_EXISTS(done);
            });
        });
    });
});
