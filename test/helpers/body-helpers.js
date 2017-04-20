'use strict';
const { expect } = require('chai');
const artisan = require('json-artisan');

const Finder = require('../../lib/models/finder');

const BODY = {};

BODY.EXPECTED = (...body) => artisan({}, ...body);

BODY.PLUCK = (body, finder) => {
    if (!(finder instanceof Finder)) finder = new Finder(finder);
    const result = {};
    for (const field of finder.getFields()) {
        result[field] = body[field];
    }
    return result;
};

BODY.EXPECT_ID = (doc, id) => {
    expect(doc.id).to.equal(id);
};

BODY.EXPECT_GENERATED_ID = (id) => {
    expect(typeof id).to.equal('string');
    expect(id.length).to.equal(32);
    for (const char of id) {
        expect('0123456789abcfdef').to.contain(char);
    }
};

BODY.EXPECT_REV = (doc, rev) => {
    expect(doc.rev).to.equal(rev);
};

BODY.EXPECT_NOT_REV = (doc, rev) => {
    expect(doc.rev).to.not.equal(rev);
};

BODY.EXPECT_LATEST_REV = (doc, rev) => {
    expect(doc._latestRev).to.equal(rev);
};

BODY.EXPECT_NOT_LATEST_REV = (doc, rev) => {
    expect(doc._latestRev).to.not.equal(rev);
};

BODY.EXPECT = (doc, expected) => {
    const body = Object.assign({}, doc.body, { _id: undefined, _rev: undefined, _attachments: undefined });
    const body2 = Object.assign({}, expected, { _id: undefined, _rev: undefined, _attachments: undefined });
    expect(body).to.eql(body2);
    const attnames = Object.keys(doc.body._attachments || {});
    const attnames2 = Object.keys(expected._attachments || {});
    expect(attnames).to.have.members(attnames2);
    for (const attname of attnames) {
        const att = doc.body._attachments[attname];
        expect(att.stub).to.be.true;
        expect(att.content_type).to.equal(expected._attachments[attname].content_type);
        expect(att).to.have.property('length');
    }
};

BODY.EXPECT_LIST = (list, finder, expected) => {
    expect(Array.isArray(list)).to.be.true;
    expect(list.length).to.equal(expected.length);
    const isPartial = finder.getFields() !== undefined;
    for (let i = 0; i < list.length; i++) {
        if (isPartial) {
            BODY.EXPECT(list[i], BODY.PLUCK(expected[i], finder));
            BODY.EXPECT_LATEST_REV(list[i], undefined);
        }
        else {
            BODY.EXPECT(list[i], expected[i]);
            BODY.EXPECT_LATEST_REV(list[i], list[i].rev);
        }
    }
};

module.exports = BODY;
