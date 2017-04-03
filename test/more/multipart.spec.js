'use strict';
const mocha = require('mocha');
const expect = require('chai').expect;

const DocMeta = require('../../lib/meta/doc-meta');
const Helpers = require('../Helpers');

describe('DocMeta multipart', function() {
    beforeEach(Helpers.DESTROY_DB);
    describe('database does not exist', function() {
    });
    describe('database exists', function() {
        beforeEach(Helpers.CREATE_DB);
        describe('document does not exist', function() {
        });
        describe('attachment does not exist', function() {
            let doc;
            beforeEach(function(done) {
                Helpers.CREATE_DOC(model => { doc = model; done(); });
            });
            describe('document has not been changed', function() {
            });
            describe('document changed', function() {
                let doc2;
                beforeEach(function(done) {
                    Helpers.BACKGROUND_CHANGE_DOC(doc, model => { doc2 = model; done(); });
                });
            });
        });
        describe('attachment exists', function() {
            let doc;
            beforeEach(function(done) {
                Helpers.CREATE_DOC_WITH_ATTACHMENT(model => { doc = model; done(); });
            });
            describe('document has not been changed', function() {
            });
            describe('document changed', function() {
                let doc2;
                beforeEach(function(done) {
                    Helpers.BACKGROUND_CHANGE_DOC(doc, model => { doc2 = model; done(); });
                });
            });
        });
    });
});
