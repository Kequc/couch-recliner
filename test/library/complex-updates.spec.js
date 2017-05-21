'use strict';
const DocMeta = require('../../lib/meta/doc-meta');
const Body = require('../../lib/models/body');

const BODY = require('../helpers/body-helpers');
const DATA = require('../helpers/data-helpers');
const DB = require('../helpers/db-helpers');
const DOC = require('../helpers/doc-helpers');
const ERR = require('../helpers/err-helpers');

describe('Library complex updates', function() {
    let doc;
    let body;
    let expected;
    beforeEach(function(done) {
        DB.RESET(() => {
            DOC.CREATE((model) => {
                doc = model;
                body = new Body(Object.assign({}, DATA.update, {
                    hello: value => value + 1,
                    deep: {
                        more: value => value + ' hi there'
                    }
                }));
                expected = BODY.DEEP_EXTEND(doc.body, DATA.update, {
                    hello: doc.body.hello + 1,
                    deep: Object.assign({}, doc.body.deep, {
                        more: doc.body.deep.more + ' hi there'
                    })
                });
                done();
            });
        });
    });
    describe('uses json-artisan', function() {
        it('update', function(done) {
            DocMeta.update(DATA.Model, doc.id, body, (err, doc2) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_ID(doc2, doc.id);
                BODY.EXPECT_NOT_REV(doc2, doc.rev);
                BODY.EXPECT_LATEST_REV(doc2, doc2.rev);
                BODY.EXPECT(doc2, expected);
                DOC.EXPECT_EXISTS(doc.id, expected, done);
            });
        });
        it('updateFixed', function(done) {
            const oldId = doc.id;
            const oldRev = doc.rev;
            DocMeta.updateFixed(doc, body, (err) => {
                ERR.EXPECT_NONE(err);
                BODY.EXPECT_ID(doc, oldId);
                BODY.EXPECT_NOT_REV(doc, oldRev);
                BODY.EXPECT_LATEST_REV(doc, doc.rev);
                BODY.EXPECT(doc, expected);
                DOC.EXPECT_EXISTS(oldId, expected, done);
            });
        });
    });
});
