'use strict';
const DbMeta = require('../../lib/meta/db-meta');

const DATA = require('../helpers/data-helpers');
const DB = require('../helpers/db-helpers');
const ERR = require('../helpers/err-helpers');

describe('Meta DbMeta', function() {
    beforeEach(DB.DESTROY);
    describe('database does not exist', function() {
        it('head', function(done) {
            DbMeta.head(DATA.Model, (err) => {
                ERR.EXPECT(err, 'not_found');
                DB.EXPECT_DOES_NOT_EXIST(done);
            });
        });
        it('create', function(done) {
            DbMeta.create(DATA.Model, (err) => {
                ERR.EXPECT_NONE(err);
                DB.EXPECT_EXISTS(done);
            });
        });
        it('destroy', function(done) {
            DbMeta.destroy(DATA.Model, (err) => {
                ERR.EXPECT_NONE(err);
                DB.EXPECT_DOES_NOT_EXIST(done);
            });
        });
        it('reset', function (done) {
            DbMeta.reset(DATA.Model, (err) => {
                ERR.EXPECT_NONE(err);
                DB.EXPECT_EXISTS(done);
            });
        });
    });
    describe('database exists', function() {
        beforeEach(DB.CREATE);
        it('head', function(done) {
            DbMeta.head(DATA.Model, (err) => {
                ERR.EXPECT_NONE(err);
                DB.EXPECT_EXISTS(done);
            });
        });
        it('create', function(done) {
            DbMeta.create(DATA.Model, (err) => {
                ERR.EXPECT_NONE(err);
                DB.EXPECT_EXISTS(done);
            });
        });
        it('destroy', function(done) {
            DbMeta.destroy(DATA.Model, (err) => {
                ERR.EXPECT_NONE(err);
                DB.EXPECT_DOES_NOT_EXIST(done);
            });
        });
        it('reset', function (done) {
            DbMeta.reset(DATA.Model, (err) => {
                ERR.EXPECT_NONE(err);
                DB.EXPECT_EXISTS(done);
            });
        });
    });
});
