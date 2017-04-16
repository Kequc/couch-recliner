'use strict';
const DbMeta = require('./meta/db-meta');
const Err = require('./models/err');

const DbOperations = {};

DbOperations.head = (Model, callback = ()=>{}) => {
    const err = Err.checkOps(Model);
    if (err)
        callback(err);
    else
        DbMeta.head(Model, callback);
};

DbOperations.reset = (Model, verify, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { verify });
    if (err)
        callback(err);
    else if (verify !== '_RESET_')
        callback(Err.invalidParam('verify'));
    else
        DbMeta.reset(Model, callback);
};

DbOperations.destroy = (Model, verify, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { verify });
    if (err)
        callback(err);
    else if (verify !== '_DESTROY_')
        callback(Err.invalidParam('verify'));
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
