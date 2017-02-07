"use strict";
const dbName = 'nano-records-db-doc-attachment-test';

const Helper = require('../helper');
const NanoRecords = require('../../index');
const nano = require('nano')("http://127.0.0.1:5984/");
const db = new NanoRecords(nano, dbName);

const assert = require('../assert/db-doc-attachment.assert');

describe('db-doc-attachment', () => {
    after((done) => {
        db.destroy('_DESTROY_', () => { done(); });
    });

    describe('database does not exist', () => {
        beforeEach((done) => {
            db.destroy('_DESTROY_', () => { done(); });
        });
        
        it('read', (done) => {
            assert.read_Fail(db, Helper.id, "not_found", done);
        });
        it('createReadStream', (done) => {
            assert.createReadStream_Fail(db, Helper.id, "not_found", done);
        });
        it('write', (done) => {
            assert.write_Fail(db, Helper.id, "not_found", done);
        });
        it('destroy', (done) => {
            assert.destroy_Fail(db, Helper.id, "not_found", done);
        });
        
    });
    
    describe('database exists', () => {
        before((done) => {
            db.reset('_RESET_', () => { done(); });
        });
        
        describe('document does not exist', () => {
            beforeEach((done) => {
                db.doc.destroy(Helper.id, () => { done(); })
            });
            
            it('read', (done) => {
                assert.read_Fail(db, Helper.id, "not_found", done);
            });
            it('createReadStream', (done) => {
                assert.createReadStream_Fail(db, Helper.id, "not_found", done);
            });
            it('write', (done) => {
                assert.write_Fail(db, Helper.id, "not_found", done);
            });
            it('destroy', (done) => {
                assert.destroy_Fail(db, Helper.id, "not_found", done);
            });
            
        });
        
        describe('document exists', () => {
            let _doc;
            beforeEach((done) => {
                _doc = undefined;
                db.doc.create(Helper.simpleBody, (err, doc) => {
                    _doc = doc;
                    done();
                });
            });
            
            describe('attachment does not exist', () => {
                
                it('read', (done) => {
                    assert.read_Fail(db, _doc.getId(), "not_found", done);
                });
                it('createReadStream', (done) => {
                    assert.createReadStream_Fail(db, _doc.getId(), "not_found", done);
                });
                it('write', (done) => {
                    assert.write(db, _doc.getId(), done);
                });
                it('write retries');
                it('write more than maxTries');
                it('destroy', (done) => {
                    assert.destroy(db, _doc.getId(), done);
                });
                it('destroy retries');
                it('destroy more than maxTries');
                
            });
            describe('attachment exists', () => {
                beforeEach((done) => {
                    _doc.attachment.write(Helper.fileName, Helper.fileContent, "text/plain", () => { done(); });
                });
                
                it('read', (done) => {
                    assert.read(db, _doc.getId(), done);
                });
                it('createReadStream', (done) => {
                    assert.createReadStream(db, _doc.getId(), done);
                });
                it('write', (done) => {
                    assert.write(db, _doc.getId(), done);
                });
                it('write retries');
                it('write more than maxTries');
                it('destroy', (done) => {
                    assert.destroy(db, _doc.getId(), done);
                });
                it('destroy retries');
                it('destroy more than maxTries');
                
            });
            
        });
        
    });
});
