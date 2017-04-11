'use strict';
const DocMeta = require('../../lib/meta/doc-meta');
const Finder = require('../../lib/util/finder');

const BODY = require('../helpers/body-helpers');
const DATA = require('../helpers/data-helpers');
const DB = require('../helpers/db-helpers');
const DOC = require('../helpers/doc-helpers');
const ERR = require('../helpers/err-helpers');

function _pluck(body, finder) {
    const result = {};
    for (const field of finder.getFields()) {
        result[field] = body[field];
    }
    return result;
}

describe('Find', function() {
    beforeEach(DB.DESTROY);
    describe('database does not exist', function() {
        it('find', function(done) {
            DocMeta.find(DATA.Model, new Finder(DATA.find), (err, list) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_LIST(list, []);
                done();
            });
        });
        it('findOne', function(done) {
            DocMeta.findOne(DATA.Model, new Finder(DATA.find), (err) => {
                ERR.EXPECT(err, 'not_found');
                done();
            });
        });
    });
    describe('database exists', function() {
        beforeEach(DB.CREATE);
        describe('documents do not exist', function() {
            it('find', function(done) {
                DocMeta.find(DATA.Model, new Finder(DATA.find), (err, list) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_LIST(list, []);
                    done();
                });
            });
            it('findOne', function(done) {
                DocMeta.findOne(DATA.Model, new Finder(DATA.find), (err) => {
                    ERR.EXPECT(err, 'not_found');
                    done();
                });
            });
        });
        describe('documents exist', function() {
            let doc;
            let doc2;
            beforeEach(function(done) {
                DOC.CREATE_MULTI((model, model2) => { doc = model; doc2 = model2; done(); });
            });
            it('find', function(done) {
                const finder = new Finder(DATA.find);
                DocMeta.find(DATA.Model, finder, (err, list) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_LIST(list, [_pluck(doc2.body, finder)]);
                    done();
                });
            });
            it('find (multiple)', function(done) {
                const finder = new Finder(DATA.find2);
                DocMeta.find(DATA.Model, finder, (err, list) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_LIST(list, [_pluck(doc.body, finder), _pluck(doc2.body, finder)]);
                    done();
                });
            });
            it('findOne', function(done) {
                const finder = new Finder(DATA.find2);
                DocMeta.findOne(DATA.Model, finder, (err, doc) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT(doc, _pluck(doc.body, finder));
                    BODY.EXPECT_LATEST_REV(doc, undefined);
                    done();
                });
            });
        });
    });
});
