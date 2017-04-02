'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const DbMeta = require('../../lib/meta/db-meta');
const Helpers = require('../Helpers');

describe('DbMeta', function() {
    beforeEach(Helpers.DESTROY_DB);
    describe('database does not exist', function() {
        it('head', function(done) {
            DbMeta.head(Helpers.Model, (err, res) => {
                Helpers.EXPECT_ERROR(err, 'no_db_file');
                Helpers.EXPECT_DB(false, done);
            });
        });
        it('create', function(done) {
            DbMeta.create(Helpers.Model, (err) => {
                Helpers.EXPECT_ERROR(err);
                Helpers.EXPECT_DB(true, done);
            });
        });
        it('destroy', function(done) {
            DbMeta.destroy(Helpers.Model, (err) => {
                Helpers.EXPECT_ERROR(err, 'no_db_file');
                Helpers.EXPECT_DB(false, done);
            });
        });
        it('reset', function (done) {
            DbMeta.reset(Helpers.Model, (err) => {
                Helpers.EXPECT_ERROR(err);
                Helpers.EXPECT_DB(true, done);
            });
        });
    });
    describe('database exists', function() {
        beforeEach(Helpers.CREATE_DB);
        it('head', function(done) {
            DbMeta.head(Helpers.Model, (err, res) => {
                Helpers.EXPECT_ERROR(err);
                Helpers.EXPECT_DB(true, done);
            });
        });
        it('create', function(done) {
            DbMeta.create(Helpers.Model, (err) => {
                Helpers.EXPECT_ERROR(err, 'db_already_exists');
                Helpers.EXPECT_DB(true, done);
            });
        });
        it('destroy', function(done) {
            DbMeta.destroy(Helpers.Model, (err) => {
                Helpers.EXPECT_ERROR(err);
                Helpers.EXPECT_DB(false, done);
            });
        });
        it('reset', function (done) {
            DbMeta.reset(Helpers.Model, (err) => {
                Helpers.EXPECT_ERROR(err);
                Helpers.EXPECT_DB(true, done);
            });
        });
    });
});
