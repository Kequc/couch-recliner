"use strict";
var dbName = 'nano-records-db-doc-attachment-test';

var NanoRecords = require('../../../../dist/nano-records');
var nano = require('nano')("http://127.0.0.1:5984/");
var db = new NanoRecords(nano, dbName);

var assert = require('../../../assert/db/doc/attachment.assert');
var Util = require('../../../assert/util');

describe('db-doc-attachment', () => {
  after((done) => {
    db.destroy('_DESTROY_', () => { done(); });
  });

  describe('database does not exist', () => {
    beforeEach((done) => {
      db.destroy('_DESTROY_', () => { done(); });
    });
    
    it('read', (done) => {
      assert.read_Fail(db, Util.id, "not_found", done);
    });
    it('createReadStream', (done) => {
      assert.createReadStream_Fail(db, Util.id, "not_found", done);
    });
    it('write', (done) => {
      assert.write_Fail(db, Util.id, "not_found", done);
    });
    it('destroy', (done) => {
      assert.destroy_Fail(db, Util.id, "not_found", done);
    });
    
  });
  
  describe('database exists', () => {
    before((done) => {
      db.reset('_RESET_', () => { done(); });
    });
    
    describe('document does not exist', () => {
      beforeEach((done) => {
        db.doc.destroy(Util.id, () => { done(); })
      });
      
      it('read', (done) => {
        assert.read_Fail(db, Util.id, "not_found", done);
      });
      it('createReadStream', (done) => {
        assert.createReadStream_Fail(db, Util.id, "not_found", done);
      });
      it('write', (done) => {
        assert.write_Fail(db, Util.id, "not_found", done);
      });
      it('destroy', (done) => {
        assert.destroy_Fail(db, Util.id, "not_found", done);
      });
      
    });
    
    describe('document exists', () => {
      var _doc;
      beforeEach((done) => {
        _doc = undefined;
        db.doc.create(Util.simpleBody, (err, doc) => {
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
          _doc.attachment.write(Util.fileName, Util.fileContent, "text/plain", () => { done(); });
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
