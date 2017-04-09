'use strict';
const expect = require('chai').expect;

const ERR = {};

ERR.EXPECT_NONE = (err) => {
    if (err) {
        console.log('UNEXPECTED ERROR:');
        console.log('name', err.name);
        console.log('raw', err.raw);
    }
    expect(err).to.be.undefined;
};

ERR.EXPECT = (err, name) => {
    expect(err).is.not.undefined;
    expect(err.name).to.equal(name);
};

module.exports = ERR;
