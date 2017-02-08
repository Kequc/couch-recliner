'use strict';
const Err = require('./err');

const DbOperations = {};

DbOperations.reset = (Model, verify, callback = ()=>{}) => {
    if (verify !== '_RESET_')
        callback(Err.verifyFailed());
    else if (!Model)
        callback(Err.missingParam('model'));
    else if (!Model.nano)
        callback(Err.missingNano());
    else
        _performReset(Model, verify, callback);
}

function _performReset (Model, verify, callback) {
    _performDestroy(Model, (err) => {
        if (err && err.name !== 'no_db_file')
            callback(err);
        else
            _performCreate(Model, callback);
    });
}

DbOperations.destroy = (Model, verify, callback = ()=>{}) => {
    if (verify !== '_DESTROY_')
        callback(Err.verifyFailed());
    else if (!Model)
        callback(Err.missingParam('model'));
    else if (!Model.nano)
        callback(Err.missingNano());
    else
        _performDestroy(Model, callback);
}

function _performDestroy(Model, callback) {
    Model.nano.db.destroy(Model.dbName, Err.resultFunc('db', callback));
}

DbOperations.create = (Model, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('model'));
    else if (!Model.nano)
        callback(Err.missingNano());
    else if (!Model.dbName)
        callback(Err.missingParam('dbName'));
    else
        _performCreate(Model, callback);
}

function _performCreate(Model, callback) {
    Model.nano.db.create(Model.dbName, Err.resultFunc('db', callback));
}

module.exports = DbOperations;
