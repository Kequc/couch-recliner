'use strict';
const expect = require('chai').expect;

const ERR = {};

ERR.EXPECT_NONE = (err) => {
    if (err) {
        // eslint-disable-next-line no-console
        console.log('UNEXPECTED ERROR:');
        // eslint-disable-next-line no-console
        console.log('name', err.name);
        // eslint-disable-next-line no-console
        console.log('raw', err.raw);
    }
    expect(err).to.be.undefined;
};

ERR.EXPECT = (err, name) => {
    expect(err).is.not.undefined;
    expect(err.name).to.equal(name);
};

module.exports = ERR;
