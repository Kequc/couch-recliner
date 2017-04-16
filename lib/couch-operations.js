'use strict';
const CouchMeta = require('./meta/couch-meta');
const Couch = require('./models/couch');
const Err = require('./models/err');

const CouchOperations = {};

CouchOperations.uuids = (couch, count, callback = ()=>{}) => {
    const err = Err.checkParams({ couch, count });
    if (err)
        callback(err);
    else if (!(couch instanceof Couch))
        callback(Err.invalidParam('couch'));
    else if (typeof count !== 'number' || count <= 0)
        callback(Err.invalidParam('count'));
    else
        CouchMeta.uuids(couch, count, callback);
};

module.exports = CouchOperations;
