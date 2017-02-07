"use strict";
const Err = require('../err');

const DbOperations = {};

DbOperations.create = (Model, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('db', 'model'));
    else if (!Model.nano)
        callback(Err.missingNano());
    else
        _performCreate(Model, callback);
}

function _performCreate(Model, callback) {
    Model.nano.db.create(Model.dbName, Err.resultFunc('db', callback));
}

DbOperations.destroy = (Model, verify, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('db', 'model'));
    else if (!Model.nano)
        callback(Err.missingNano());
    else if (verify !== "_DESTROY_")
        callback(Err.verifyFailed('db'));
    else
        _performDestroy(Model, callback);
}

function _performDestroy(Model, callback) {
    Model.nano.db.destroy(Model.dbName, Err.resultFunc('db', callback));
}

DbOperations.reset = (Model, verify, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('db', 'model'));
    else if (!Model.nano)
        callback(Err.missingNano());
    else if (verify !== "_RESET_")
        callback(Err.verifyFailed('db'));
    else
        _performReset(Model, verify, callback);
}

function _performReset (Model, verify, callback) {
    DbOperations.destroy(Model, "_DESTROY_", (err) => {
        if (!err || err.name == "no_db_file")
            DbOperations.create(Model, callback);
        else
            callback(err);
    });
}

module.exports = DbOperations;
