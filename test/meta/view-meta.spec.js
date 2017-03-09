'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const ViewMeta = require('../../lib/meta/view-meta');
const Helpers = require('../Helpers');

describe('ViewMeta', function() {
    beforeEach(Helpers.DESTROY_DB);
    describe('database does not exist', function() {
    });
    describe('database exists', function() {
        beforeEach(Helpers.CREATE_DB);
        describe('document does not exist', function() {
        });
        describe('document exists', function() {
            beforeEach(Helpers.CREATE_DOC);
        });
    });
});
