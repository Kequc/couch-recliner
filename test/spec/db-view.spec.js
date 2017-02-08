'use strict';

const dbName = 'nano-records-db-view-test';

const Helper = require('../helper');
const NanoRecords = require('../../lib/index');
const nano = require('nano')('http://127.0.0.1:5984/');
const db = new NanoRecords(nano, dbName, Helper.designs);

const assert = require('../assert/db-view.assert');

describe('db-view', () => {
    after((done) => {
        db.destroy('_DESTROY_', () => { done(); });
    });
    
    describe('database does not exist', () => {
        beforeEach((done) => {
            db.destroy('_DESTROY_', () => { done(); });
        });
        
        it('find', (done) => {
            assert.find(db, 'key', {}, [], done);
        });
        it('findOne');
        it('findStrict', (done) => {
            assert.findStrict(db, 'key', 'value', {}, [], done);
        });
        it('findOneStrict');
        it('catalog', (done) => {
            assert.catalog(db, 'foo', 'comments', done);
        });
        it('catalog retries');
        it('catalog more than maxTries');
        
    });
    
    describe('database exists', () => {
        before((done) => {
            db.reset('_RESET_', () => { done(); });
        });
        
        describe('no results', () => {
            beforeEach((done) => {
                db.doc.destroy('_design/_nano_records', () => { done(); });
            });
                
            it('find', (done) => {
                assert.find(db, 'num', {}, [], done);
            });
            it('findOne');
            it('findStrict', (done) => {
                assert.findStrict(db, 'num', 'deep', {}, [], done);
            });
            it('findOneStrict');
            
        });
        
        describe('results to show', () => {
            let _docs = [];
            before((done) => {
                _docs = [];
                db.doc.create(Helper.complexBody, (err, doc) => {
                    _docs.push(doc);
                    db.doc.create(Helper.simpleBody, (err, doc) => {
                        _docs.push(doc);
                        done();
                    });
                });
            });
            beforeEach((done) => {
                db.doc.destroy('_design/_nano_records', () => { done(); });
            });
            
            it('find', (done) => {
                let expected = [Helper.simpleBody, Helper.complexBody];
                assert.find(db, 'num', {}, expected, done);
            });
            it('findOne');
            it('find with lookup', (done) => {
                let expected = [Helper.complexBody];
                assert.find(db, 'num', { key: Helper.complexBody.num }, expected, done);
            });
            it('find with multiple keys', (done) => {
                let expected = [Helper.simpleBody, Helper.complexBody];
                assert.find(db, ['num', 'complex'], {}, expected, done);
            });
            it('find with multiple keys with lookup', (done) => {
                let expected = [Helper.complexBody];
                assert.find(db, ['num', 'complex'], { key: [Helper.complexBody.num, Helper.complexBody.complex] }, expected, done);
            });
            it('find with nested keys', (done) => {
                let expected = [Helper.complexBody];
                assert.find(db, ['num', 'deep.hi'], {}, expected, done);
            });
            it('findStrict', (done) => {
                let expected = [{ deep: Helper.simpleBody.deep }, { deep: Helper.complexBody.deep }];
                assert.findStrict(db, 'num', 'deep', {}, expected, done);
            });
            it('findOneStrict');
            it('findStrict with lookup', (done) => {
                let expected = [{}];
                assert.findStrict(db, 'num', 'deep', { key: Helper.simpleBody.num }, expected, done);
            });
            it('findStrict with multiple values', (done) => {
                let expected = [{ num: Helper.simpleBody.num, deep: Helper.simpleBody.deep }, { num: Helper.complexBody.num, deep: Helper.complexBody.deep }];
                assert.findStrict(db, 'num', ['num', 'deep'], {}, expected, done);
            });
            it('findStrict with nested values', (done) => {
                let expected = [{ num: Helper.complexBody.num, deep: { hi: Helper.complexBody.deep.hi } }];
                assert.findStrict(db, 'num', ['num', 'deep.hi'], {}, expected, done);
            });
            it('findStrict with multiple keys and values', (done) => {
                let expected = [{ num: Helper.simpleBody.num, deep: Helper.simpleBody.deep }, { num: Helper.complexBody.num, deep: Helper.complexBody.deep }];
                assert.findStrict(db, ['num', 'complex'], ['num', 'deep'], {}, expected, done);
            });
            it('findStrict with multiple keys and values and lookup', (done) => {
                let expected = [{ num: Helper.simpleBody.num }];
                assert.findStrict(db, ['num', 'complex'], ['num', 'deep'], { key: [Helper.simpleBody.num, Helper.simpleBody.complex] }, expected, done);
            });
            
        });
        
        describe('design does not exist', () => {
            beforeEach((done) => {
                db.doc.destroy('_design/foo', () => { done(); });
            });
            
            describe('definition does not exist', () => {
                
                it('catalog', (done) => {
                    assert.catalog_Fail(db, 'foo', 'does-not-exist', 'missing_view', done);
                });
                
            });
            
            describe('definition exists', () => {
                
                it('catalog', (done) => {
                    assert.catalog(db, 'foo', 'comments', done);
                });
                it('catalog retries');
                it('catalog more than maxTries');
                
            });
            
        });
        
        describe('design exists', () => {
            before((done) => {
                db.doc.write('_design/foo', {}, () => { done(); });
            });
            
            describe('definition does not exist', () => {
                
                it('catalog', (done) => {
                    assert.catalog_Fail(db, 'foo', 'does-not-exist', 'missing_view', done);
                });
                
            });
            
            describe('definition exists', () => {
                
                it('catalog', (done) => {
                    assert.catalog(db, 'foo', 'comments', done);
                });
                it('catalog retries');
                it('catalog more than maxTries');
                // it('catalog retries', (done) => {
                //     assert.catalog_Retries(db, 'foo', 'comments', done);
                // });
                // it('catalog more than maxTries', (done) => {
                //     assert.catalog_Retries_Fail(db, 'foo', 'comments', done);
                // });
                
            });
        });
    });
    
});
