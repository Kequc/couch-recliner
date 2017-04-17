'use strict';
const FindMeta = require('../../lib/meta/find-meta');
const Finder = require('../../lib/models/finder');

const BODY = require('../helpers/body-helpers');
const DATA = require('../helpers/data-helpers');
const DB = require('../helpers/db-helpers');
const DOC = require('../helpers/doc-helpers');
const ERR = require('../helpers/err-helpers');

describe('Meta FindMeta', function() {
    beforeEach(DB.DESTROY);
    describe('database does not exist', function() {
        it('find', function(done) {
            const finder = new Finder(DATA.find);
            FindMeta.find(DATA.Model, finder, (err, list) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_LIST(list, finder, []);
                done();
            });
        });
        it('findOne', function(done) {
            const finder = new Finder(DATA.find);
            FindMeta.findOne(DATA.Model, finder, (err) => {
                ERR.EXPECT(err, 'not_found');
                done();
            });
        });
    });
    describe('database exists', function() {
        beforeEach(DB.CREATE);
        describe('documents do not exist', function() {
            it('find', function(done) {
                const finder = new Finder(DATA.find);
                FindMeta.find(DATA.Model, finder, (err, list) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_LIST(list, finder, []);
                    done();
                });
            });
            it('findOne', function(done) {
                const finder = new Finder(DATA.find);
                FindMeta.findOne(DATA.Model, finder, (err) => {
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
                FindMeta.find(DATA.Model, finder, (err, docs) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_LIST(docs, finder, [doc2.body]);
                    done();
                });
            });
            it('find full documents', function(done) {
                const finder = new Finder(Object.assign({}, DATA.find, {
                    fields: undefined
                }));
                FindMeta.find(DATA.Model, finder, (err, docs) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_LIST(docs, finder, [doc2.body]);
                    done();
                });
            });
            it('find multiple', function(done) {
                const finder = new Finder(DATA.find2);
                FindMeta.find(DATA.Model, finder, (err, docs) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_LIST(docs, finder, [doc.body, doc2.body]);
                    done();
                });
            });
            it('find multiple full documents', function(done) {
                const finder = new Finder(Object.assign({}, DATA.find2, {
                    fields: undefined
                }));
                FindMeta.find(DATA.Model, finder, (err, docs) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT_LIST(docs, finder, [doc.body, doc2.body]);
                    done();
                });
            });
            it('findOne', function(done) {
                const finder = new Finder(DATA.find2);
                FindMeta.findOne(DATA.Model, finder, (err, doc) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT(doc, BODY.PLUCK(doc.body, finder));
                    BODY.EXPECT_LATEST_REV(doc, undefined);
                    done();
                });
            });
            it('findOne full document', function(done) {
                const finder = new Finder(Object.assign({}, DATA.find2, {
                    fields: undefined
                }));
                FindMeta.findOne(DATA.Model, finder, (err, doc) => {
                    ERR.EXPECT_NONE(err);
                    BODY.EXPECT(doc, doc.body);
                    BODY.EXPECT_LATEST_REV(doc, doc.rev);
                    done();
                });
            });
        });
    });
});
