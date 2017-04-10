'use strict';
const DbMeta = require('../../lib/meta/db-meta');

const DATA = require('./data-helpers');
const ERR = require('./err-helpers');

const DB = {};

DB.DESTROY = (done) => {
    DbMeta.destroy(DATA.Model, (err) => {
        ERR.EXPECT_NONE(err);
        done();
    });
};

DB.CREATE = (done) => {
    DbMeta.create(DATA.Model, (err) => {
        ERR.EXPECT_NONE(err);
        done();
    });
};

DB.RESET = (done) => {
    DbMeta.reset(DATA.Model, (err) => {
        ERR.EXPECT_NONE(err);
        done();
    });
};

DB.EXPECT_DOES_NOT_EXIST = (done) => {
    DbMeta.head(DATA.Model, (err) => {
        ERR.EXPECT(err, 'not_found');
        done();
    });
};

DB.EXPECT_EXISTS = (done) => {
    DbMeta.head(DATA.Model, (err) => {
        ERR.EXPECT_NONE(err);
        done();
    });
};

module.exports = DB;
