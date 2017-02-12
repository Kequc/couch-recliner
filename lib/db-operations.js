'use strict';
const DbMeta = require('./util/db-meta');
const Err = require('./err');

const DbOperations = {};

DbOperations.reset = (Model, verify, callback = ()=>{}) => {
    const err = Err.checkOps(Model);
    if (err)
        callback(err);
    else if (verify !== '_RESET_')
        callback(Err.verifyFailed());
    else
        DbMeta.reset(Model, callback);
};

DbOperations.destroy = (Model, verify, callback = ()=>{}) => {
    const err = Err.checkOps(Model);
    if (err)
        callback(err);
    else if (verify !== '_DESTROY_')
        callback(Err.verifyFailed());
    else
        DbMeta.destroy(Model, callback);
};

DbOperations.create = (Model, callback = ()=>{}) => {
    const err = Err.checkOps(Model);
    if (err)
        callback(err);
    else
        DbMeta.create(Model, callback);
};

module.exports = DbOperations;
