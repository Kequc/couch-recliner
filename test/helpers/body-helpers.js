'use strict';
const expect = require('chai').expect;

const BODY = {};

BODY.EXPECT_ID = (doc, id) => {
    expect(doc.id).to.equal(id);
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

module.exports = BODY;
