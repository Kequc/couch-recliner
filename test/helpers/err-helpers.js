'use strict';
const { expect } = require('chai');

const ERR = {};

ERR.EXPECT_PARAM_ERROR = (valid, index, param, name, done) => {
    const params = [];
    for (let i = 0; i < valid.length; i++) {
        params.push((i === index ? param : valid[i]));
    }
    params.push((err) => { ERR.EXPECT(err, name); done(); });
    return params;
};

function _testParams(func, valid, invalid, index, pos, done) {
    const finishedAll = invalid.length <= index;
    if (finishedAll) {
        done();
        return;
    }

    const finishedIndex = invalid[index].length <= pos;
    if (finishedIndex) {
        func(...ERR.EXPECT_PARAM_ERROR(valid, index, undefined, 'missing_param', () => {
            _testParams(func, valid, invalid, index + 1, 0, done);
        }));
        return;
    }

    func(...ERR.EXPECT_PARAM_ERROR(valid, index, invalid[index][pos], 'invalid_param', () => {
        _testParams(func, valid, invalid, index, pos + 1, done);
    }));
}

ERR.EXPECT_PARAM_ERRORS = (func, valid, invalid, done) => {
    _testParams(func, valid, invalid, 0, 0, done);
};

ERR.EXPECT_NONE = (err) => {
    if (err) {
        // eslint-disable-next-line no-console
        console.log('UNEXPECTED ERROR:');
        // eslint-disable-next-line no-console
        console.log('name', err.name);
        // eslint-disable-next-line no-console
        console.log('message', err.message);
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
