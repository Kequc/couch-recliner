var mocha  = require('mocha');
var expect = require('chai').expect;
var assert = require('chai').assert;
var deepExtend = require('deep-extend');

var designs = {
  "foo": {
    "views": {
      "comments": {
        "map": "function (doc) { ... };",
        "reduce": "function (keys, values, rereduce) { ... };"
      }
    },
    "shows": {
      "post": "function (doc, req) { ... };"
    },
    "lists": {
      "by_title": "function (head, req) { ... };"
    }
  },
  "bar": {
    "language": "javascript",
    "views": {}
  }
};
var dbName = 'nano-records-test';
var docs = [];

var NanoRecords = require('../dist/nano-records');
var nano = require('nano')("http://127.0.0.1:5984/");
var forced = nano.use(dbName);
var db = new NanoRecords(nano, dbName, designs);

function forceUpdate (doc, data, callback) {
  forced.get(doc.body['_id'], function (err, body) {
    deepExtend(body, data);
    forced.insert(body, callback);
  });
}

describe('nano-records.js', function () {
  before(function (done) {
    nano.db.destroy(dbName, function () { done(); });
  });
  // ok tests start here
  
  it('exists', function () {
    expect(db.nano).to.equal(nano);
    expect(db.dbName).to.equal(dbName);
    expect(db.designs).to.have.all.keys("foo", "bar");
    expect(db.designs["foo"]).to.have.all.keys("language", "views", "shows");
    expect(db.designs["bar"]).to.have.all.keys("language", "views", "shows");
    expect(db.raw).to.respondTo('insert'); // is a nano instance
  });
  
  it('docCreate a database and document', function (done) {
    db.doc.create({ hello: 'there!' }, function (err, doc) {
      expect(err).to.be.null;
      expect(doc).to.be.ok;
      expect(doc.body).to.have.all.keys('hello', '_id', '_rev');
      docs.push(doc); // store for later
      done();
    });
  });
  
  it('docCreate', function (done) {
    db.doc.create({ second: 'document', num: 666 }, function (err, doc) {
      expect(err).to.be.null;
      expect(doc).to.be.ok;
      expect(doc.body).to.have.all.keys('second', 'num', '_id', '_rev');
      docs.push(doc); // store for later
      done();
    });
  });
  
  it('complex docCreate', function (done) {
    db.doc.create({ third: 'document', num: 11, deep: { hi: "again.", arr: ["some", "values"] } }, function (err, doc) {
      expect(err).to.be.null;
      expect(doc).to.be.ok;
      expect(doc.body).to.have.all.keys('third', 'num', 'deep', '_id', '_rev');
      expect(doc.body['deep']).to.have.all.keys('hi', 'arr');
      expect(doc.body['deep']['arr']).to.eql(["some", "values"]);
      docs.push(doc); // store for later
      done();
    });
  });
  
  describe('document', function () {
    var destroyedDoc;
    
    it('getId', function () {
      var doc = docs[0];
      expect(doc.body['_id']).to.be.ok;
      expect(doc.getId()).to.equal(doc.body['_id']);
    });
    
    it('getRev', function () {
      var doc = docs[0];
      expect(doc.body['_rev']).to.be.ok;
      expect(doc.getRev()).to.equal(doc.body['_rev']);
    });
    
    it('hasAttachment', function () {
      // TODO
    });
    
    it('update', function (done) {
      var doc = docs[0];
      doc.update({ more: 'attributes' }, function (err) {
        expect(err).to.be.null;
        expect(doc.body).to.have.all.keys('hello', 'more', '_id', '_rev');
        expect(doc.body['more']).to.equal('attributes');
        done();
      });
    });
    
    it('retrieveLatest', function (done) {
      var doc = docs[1];
      forceUpdate(doc, { anotheranother: "Yay!" }, function (err) {
        expect(err).to.be.null;
        expect(doc.body).to.not.have.keys('anotheranother');
        var oldRev1 = doc.body['_rev'];
        doc.retrieveLatest(function (err) {
          expect(err).to.be.null;
          expect(doc.body).to.have.all.keys('second', 'num', '_id', '_rev', 'anotheranother');
          expect(doc.body['_rev']).to.not.equal(oldRev1);
          done();
        });
      });
    });
    
    it('recovers from bad update', function (done) {
      var doc = docs[1];
      forceUpdate(doc, { anotheranother: "changed" }, function (err, body) {
        expect(err).to.be.null;
        var oldRev1 = doc.body['_rev'];
        var oldRev2 = body['rev'];
        expect(oldRev1).to.not.equal(oldRev2);
        doc.update({ added: 'attr-again' }, function (err) {
          expect(err).to.be.null;
          expect(doc.body).to.have.all.keys('second', 'num', '_id', '_rev', 'anotheranother', 'added');
          expect(doc.body['anotheranother']).to.equal('changed');
          expect(doc.body['added']).to.equal('attr-again');
          expect(doc.body['_rev']).to.not.equal(oldRev1);
          expect(doc.body['_rev']).to.not.equal(oldRev2);
          done();
        });
      });
    });
    
    it('destroy', function (done) {
      db.doc.create({ temp: 'document', num: 96 }, function (err, doc) {
        expect(err).to.be.null;
        expect(doc).to.be.ok;
        expect(doc.body).to.have.all.keys('temp', 'num', '_id', '_rev');
        destroyedDoc = doc; // store for later
        doc.destroy(function (err) {
          expect(err).to.be.null;
          expect(doc.body).to.eql({});
          done();
        });
      });
    });
    
    it('update destroyed doc should fail', function (done) {
      destroyedDoc.update({ boo: "oorns" }, function (err) {
        expect(err).to.be.ok;
        done();
      });
    });
    
    it('retrieveLatest destroyed doc should fail', function (done) {
      destroyedDoc.retrieveLatest(function (err) {
        expect(err).to.be.ok;
        done();
      });
    });
    
    it('destroy destroyed doc should fail', function (done) {
      destroyedDoc.destroy(function (err) {
        expect(err).to.be.ok;
        done();
      });
    });
    
    it('addAttachment', function (done) {
      done();
    });
    
    it('getAttachment', function (done) {
      done();
    });
    
    it('destroyAttachment', function (done) {
      done();
    });
    
    it('get destroyed attachment should fail', function (done) {
      done();
    });
    
    it('addAttachment to destroyed doc should fail', function (done) {
      done();
    });
    
    it('getAttachment from destroyed doc should fail', function (done) {
      done();
    });
    
    it('destroyAttachment to destroyed doc should fail', function (done) {
      done();
    });
  });
  
  it('docGet', function (done) {
    db.doc.get(docs[0].body['_id'], function (err, doc) {
      expect(err).to.be.null;
      expect(doc).to.be.ok;
      expect(doc.body).to.eql(docs[0].body);
      done();
    });
  });
  
  it('missing docGet', function (done) {
    db.doc.get("fake-id-doesnt-exist", function (err, doc) {
      expect(err).to.be.ok;
      expect(doc).to.be.undefined;
      done();
    });
  });
  
  it('docUpdate', function (done) {
    var doc = docs[2];
    db.doc.update(docs[2].body['_id'], { updated: 'changehere' }, function (err) {
      expect(err).to.be.null;
      doc.retrieveLatest(function (err) {
        expect(err).to.be.null;
        expect(doc.body).to.have.all.keys('third', 'num', 'deep', 'updated', '_id', '_rev');
        expect(doc.body['deep']).to.have.all.keys('hi', 'arr');
        expect(doc.body['deep']['arr']).to.eql(["some", "values"]);
        expect(doc.body['updated']).to.equal('changehere');
        done();
      });
    });
  });
  
  it('missing docUpdate', function (done) {
    db.doc.update("fake-id-doesnt-exist", { blah: 'will fail' }, function (err, doc) {
      expect(err).to.be.ok;
      expect(doc).to.be.undefined;
      done();
    });
  });
  
  it('docDestroy', function (done) {
    db.doc.create({ temp: 'document', num: 1011 }, function (err, doc) {
      expect(err).to.be.null;
      expect(doc).to.be.ok;
      db.doc.destroy(doc.body['_id'], function (err) {
        expect(err).to.be.null;
        done();
      });
    });
  });
  
  it('missing docDestroy', function (done) {
    db.doc.destroy("fake-id-doesnt-exist", function (err, doc) {
      expect(err).to.be.ok;
      expect(doc).to.be.undefined;
      done();
    });
  });
  
  it('designView create a design document with a view', function (done) {
      done();
  });
  
  it('designView', function (done) {
      done();
  });
  
  it('designShow create a design document with a show', function (done) {
      done();
  });
  
  it('designShow', function (done) {
      done();
  });
  
  it('designList', function (done) {
      done();
  });
  
  it('designView missing view should fail', function (done) {
      done();
  });
  
  it('designShow missing show should fail', function (done) {
      done();
  });
});
