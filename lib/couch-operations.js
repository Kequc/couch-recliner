'use strict';
const CouchMeta = require('./meta/couch-meta');
const Couch = require('./models/couch');
const Err = require('./models/err');

const CouchOperations = {};

CouchOperations.nextId = (couch, callback = ()=>{}) => {
    const err = Err.checkParams({ couch });
    if (err)
        callback(err);
    else if (!(couch instanceof Couch))
        callback(Err.invalidParam('couch'));
    else
        CouchMeta.nextId(couch, callback);
};

module.exports = CouchOperations;
