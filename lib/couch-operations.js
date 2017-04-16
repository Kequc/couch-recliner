'use strict';
const CouchMeta = require('./meta/couch-meta');
const Err = require('./models/err');

const CouchOperations = {};

CouchOperations.uuids = (couch, count, callback = ()=>{}) => {
    const err = Err.checkOpsCouch(couch, { count });
    if (err)
        callback(err);
    else if (typeof count !== 'number' || count <= 0)
        callback(Err.invalidParam('count'));
    else
        CouchMeta.uuids(couch, count, callback);
};

module.exports = CouchOperations;
