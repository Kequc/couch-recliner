'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const ShowMeta = require('../../lib/meta/show-meta');
const Helpers = require('../Helpers');

describe('ShowMeta', function() {
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
