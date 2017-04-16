'use strict';
const { expect } = require('chai');

const Err = require('../../lib/models/err');
const Model = require('../../lib/model');

const DATA = require('../helpers/data-helpers');
const ERR = require('../helpers/err-helpers');

describe('Models Err', function() {
    const E = {
        scope: 'fake',
        name: 'fake_error',
        message: 'A fake error occurred.',
        raw: {
            a: 'mess',
            of: 'extra',
            data: {
                hi: 'there',
                something: 22
            }
        }
    };
    describe('constructor', function() {
        it('instantiates with default data', function() {
            const result = new Err();
            ERR.EXPECT(result, 'unknown_error');
            expect(result).to.have.property('scope', undefined);
            expect(result).to.have.property('name', 'unknown_error');
            expect(result).to.have.property('message', 'No additional information available.');
            expect(result.raw).to.eql({});
        });
        it('instantiates with data', function() {
            const result = new Err(E.scope, E.name, E.message, E.raw);
            ERR.EXPECT(result, E.name);
            expect(result).to.have.property('scope', E.scope);
            expect(result).to.have.property('name', E.name);
            expect(result).to.have.property('message', E.message);
            expect(result.raw).to.eql(E.raw);
        });
    });
    describe('checkOpsFixed', function() {
        it('returns error on invalid doc', function() {
            ERR.EXPECT(Err.checkOpsFixed(), 'missing_param');
            ERR.EXPECT(Err.checkOpsFixed({}), 'invalid_param');
            ERR.EXPECT(Err.checkOpsFixed(0), 'invalid_param');
            ERR.EXPECT(Err.checkOpsFixed('hi'), 'invalid_param');
            class MyModel extends Model {}
            const doc = new MyModel();
            doc._id = DATA.id;
            ERR.EXPECT(Err.checkOpsFixed(doc), 'invalid_param');
        });
        it('returns error on missing id', function() {
            class MyModel extends Model {}
            MyModel.dbName = DATA.dbName;
            ERR.EXPECT(Err.checkOpsFixed(new MyModel()), 'missing_param');
        });
        it('returns error on missing parameters', function() {
            class MyModel extends Model {}
            MyModel.dbName = DATA.dbName;
            const doc = new MyModel();
            doc._id = DATA.id;
            ERR.EXPECT(Err.checkOpsFixed(doc, { a: undefined, b: 'hi', c: 2 }), 'missing_param');
            ERR.EXPECT(Err.checkOpsFixed(doc, { a: {}, b: undefined, c: 2 }), 'missing_param');
            ERR.EXPECT(Err.checkOpsFixed(doc, { a: {}, b: 'hi', c: undefined }), 'missing_param');
        });
        it('returns no error', function() {
            class MyModel extends Model {}
            MyModel.dbName = DATA.dbName;
            const doc = new MyModel();
            doc._id = DATA.id;
            ERR.EXPECT_NONE(Err.checkOpsFixed(doc, { a: {}, b: 'hi', c: 2 }));
        });
    });
    describe('checkOps', function() {
        it('returns error on invalid Model', function() {
            ERR.EXPECT(Err.checkOps(), 'missing_param');
            ERR.EXPECT(Err.checkOps({}), 'invalid_param');
            ERR.EXPECT(Err.checkOps(0), 'invalid_param');
            ERR.EXPECT(Err.checkOps('hi'), 'invalid_param');
            class MyModel extends Model {}
            ERR.EXPECT(Err.checkOpsFixed(MyModel), 'invalid_param');
        });
        it('returns error on missing parameters', function() {
            class MyModel extends Model {}
            MyModel.dbName = DATA.dbName;
            ERR.EXPECT(Err.checkOps(MyModel, { a: undefined, b: 'hi', c: 2 }), 'missing_param');
            ERR.EXPECT(Err.checkOps(MyModel, { a: {}, b: undefined, c: 2 }), 'missing_param');
            ERR.EXPECT(Err.checkOps(MyModel, { a: {}, b: 'hi', c: undefined }), 'missing_param');
        });
        it('returns no error', function() {
            class MyModel extends Model {}
            MyModel.dbName = DATA.dbName;
            ERR.EXPECT_NONE(Err.checkOps(MyModel, { a: {}, b: 'hi', c: 2 }));
        });
    });
    describe('checkParams', function() {
        it('returns error on missing parameters', function() {
            ERR.EXPECT(Err.checkParams({ a: undefined, b: 'hi', c: 2 }), 'missing_param');
            ERR.EXPECT(Err.checkParams({ a: {}, b: undefined, c: 2 }), 'missing_param');
            ERR.EXPECT(Err.checkParams({ a: {}, b: 'hi', c: undefined }), 'missing_param');
        });
        it('returns no error', function() {
            ERR.EXPECT_NONE(Err.checkParams(undefined));
            ERR.EXPECT_NONE(Err.checkParams({ a: {}, b: 'hi', c: 2 }));
        });
    });
    describe('make', function() {
        it('returns no error on 200+/-400 response', function() {
            for (let statusCode = 200; statusCode < 400; statusCode++) {
                ERR.EXPECT_NONE(Err.make(E.scope, undefined, { statusCode }));
            }
        });
        it('detects database missing', function() {
            ERR.EXPECT(Err.make(E.scope, undefined, { statusCode: 412 }), 'db_already_exists');
        });
        it('detects missing', function() {
            ERR.EXPECT(Err.make(E.scope, undefined, { statusCode: 404 }), 'not_found');
        });
        it('detects badly formatted missing couch error', function() {
            ERR.EXPECT(Err.make(E.scope, undefined, { statusCode: 500, body: { error: '{not_found,missing}' } }), 'not_found');
        });
        it('performs best guess', function() {
            ERR.EXPECT(Err.make(E.scope, undefined, { statusCode: 500, body: { error: E.name } }), E.name);
            ERR.EXPECT(Err.make(E.scope, undefined, { statusCode: 200, body: { error: E.name } }), E.name);
        });
    });
    describe('common ones', function() {
        it('generates common errors', function() {
            ERR.EXPECT(Err.missing(E.scope), 'not_found');
            ERR.EXPECT(Err.missingParam('hi'), 'missing_param');
            ERR.EXPECT(Err.invalidParam('hi'), 'invalid_param');
            ERR.EXPECT(Err.conflict(E.scope), 'conflict');
        });
    });
});
