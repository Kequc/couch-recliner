'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const ViewMeta = require('../../lib/meta/view-meta');

const DB = require('../helpers/db-helpers');

describe('ViewMeta', function() {
    beforeEach(DB.DESTROY);
    describe('database does not exist', function() {
    });
    describe('database exists', function() {
        beforeEach(DB.CREATE);
        describe('document does not exist', function() {
        });
        describe('document exists', function() {
        });
    });
});
