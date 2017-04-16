'use strict';
const { expect } = require('chai');

const { Couch, Model } = require('../lib');

describe('Prime Model', function() {
    it('has couch', function() {
        expect(Model).to.have.property('couch');
        expect(Model.couch).to.be.instanceof(Couch);
    });
    it('can set couch', function() {
        class MyModel extends Model {}
        const any = 'http://test.com';
        expect(MyModel).to.have.property('couch');
        expect(MyModel.couch.baseUrl).to.not.equal(any);
        MyModel.couch = { any };
        expect(MyModel.couch.baseUrl).to.equal(any);
    });
    it('has MAX_TRIES', function() {
        expect(Model).to.have.property('MAX_TRIES').is.a('number');
        expect(Model.MAX_TRIES).to.be.gt(0);
    });
    it('can set MAX_TRIES', function() {
        class MyModel extends Model {}
        expect(MyModel).to.have.property('MAX_TRIES').is.a('number');
        const oldMaxTries = MyModel.MAX_TRIES;
        MyModel.MAX_TRIES = oldMaxTries + 1;
        expect(MyModel.MAX_TRIES).to.equal(oldMaxTries + 1);
    });
    it('has expected static properties', function() {
        expect(Model).to.have.property('create').is.a('function');
        expect(Model).to.have.property('read').is.a('function');
        expect(Model).to.have.property('write').is.a('function');
        expect(Model).to.have.property('update').is.a('function');
        expect(Model).to.have.property('updateOrWrite').is.a('function');
        expect(Model).to.have.property('destroy').is.a('function');
        expect(Model).to.have.property('head').is.a('function');
        expect(Model).to.have.property('findOne').is.a('function');
        expect(Model).to.have.property('find').is.a('function');
        expect(Model).to.have.property('attachment').is.a('function');
    });
    it('has expected instance properties', function() {
        const model = new Model();
        expect(model).to.have.property('read').is.a('function');
        expect(model).to.have.property('write').is.a('function');
        expect(model).to.have.property('update').is.a('function');
        expect(model).to.have.property('destroy').is.a('function');
        expect(model).to.have.property('head').is.a('function');
        expect(model).to.have.property('attachment').is.a('function');
        expect(model).to.have.property('id');
        expect(model).to.have.property('rev');
        expect(model).to.have.property('body');
    });
});
