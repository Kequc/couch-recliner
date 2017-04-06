'use strict';
const Err = require('./util/err');
const CouchMeta = require('./meta/couch-meta');

const CouchOperations = {};

CouchOperations.uuid = (couch, count, callback = ()=>{}) => {
    const err = Err.checkOpsCouch(couch, { count });
    if (err)
        callback(err);
    else if (typeof count !== 'number' || count <= 0)
        callback(Err.invalidParam('count'));
    else
        CouchMeta.uuid(couch, count, callback);
};

module.exports = CouchOperations;
