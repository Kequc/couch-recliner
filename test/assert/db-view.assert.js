"use strict";
const mocha = require('mocha');
const expect = require('chai').expect;
const deepExtend = require('deep-extend');

const Helper = require('../helper');

const DbViewAssert = {};

DbViewAssert.find_Fail = (db, keys, params, errorName, done) => {
    db.view.find(keys, params, (err, list) => {
        expect(err).to.be.ok;
        expect(err.name).to.equal(errorName);
        expect(list).to.be.ok;
        expect(list.rows.length).to.equal(0);
        done();
    });
};

DbViewAssert.find = (db, keys, params, expected, done) => {
    db.view.find(keys, params, (err, list) => {
        expect(err).to.be.undefined;
        expect(list).to.be.ok;
        expect(list.rows.length).to.equal(expected.length);
        Helper.checkList(list, expected);
        done();
    });
};

DbViewAssert.findStrict_Fail = (db, keys, values, params, errorName, done) => {
    db.view.findStrict(keys, values, params, (err, list) => {
        expect(err).to.be.ok;
        expect(err.name).to.equal(errorName);
        expect(list).to.be.ok;
        expect(list.rows.length).to.equal(0);
        done();
    });
};

DbViewAssert.findStrict = (db, keys, values, params, expected, done) => {
    db.view.findStrict(keys, values, params, (err, list) => {
        expect(err).to.be.undefined;
        expect(list).to.be.ok;
        expect(list.rows.length).to.equal(expected.length);
        Helper.checkList(list, expected);
        done();
    });
};

DbViewAssert.catalog_Fail = (db, design, name, errorName, done) => {
    db.view.catalog(design, name, {}, (err, list) => {
        expect(err).to.be.ok;
        expect(err.name).to.equal(errorName);
        expect(list).to.be.ok;
        expect(list.rows.length).to.equal(0);
        done();
    });
};

DbViewAssert.catalog = (db, design, name, done) => {
    db.view.catalog(design, name, {}, (err, list) => {
        expect(err).to.be.undefined;
        expect(list).to.be.ok;
        done();
    });
};

// TODO: not currently a way to test this
DbViewAssert.catalog_Retries = (db, design, name, done) => {
    Helper.triggerBgDesignUpdate(db, design, () => {
        DbDesign.catalog(db, design, name, done);
    });
};

// TODO: not currently a way to test this
DbViewAssert.catalog_Retries_Fail = (db, design, name, done) => {
    Helper.triggerBgDesignUpdate(db, design, () => {
        db.view.catalog(design, name, {}, (err, list) => {
            expect(err).to.be.ok;
            expect(err.name).to.equal("conflict");
            expect(list).to.be.ok;
            expect(list.rows.length).to.equal(0);
            done();
        }, db.maxTries); // tried x times
    });
};

module.exports = DbViewAssert;
