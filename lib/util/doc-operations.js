"use strict";
const deepExtend = require('deep-extend');

const Err = require('../err');
const DbOperations = require('./db-operations');

const MAX_TRIES = 5;

const DocOperations = {};

DocOperations.read = (doc, callback = ()=>{}) => {
    if (!doc || !doc.getId())
        callback(Err.missingId('doc'));
    else if (!doc.constructor.nano)
        callback(Err.missingNano());
    else
        _read(doc, callback);
};

DocOperations.readId = (Model, id, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('doc', 'model'));
    else if (!Model.scope)
        callback(Err.missingNano());
    else if (!id)
        callback(Err.missingId('doc'));
    else
        _readId(Model, id, callback);
};

function _read(doc, callback) {
    _performReadId(doc.constructor, doc.getId(), (err, result) => {
        if (err)
            callback(err);
        else {
            doc.body = result;
            doc._latestRev = result['_rev'];
            callback(); // up to date
        }
    });
}

function _readId(Model, id, callback, tries = 0) {
    tries++;
    _performReadId(Model, id, (err, result) => {
        if (err && tries <= 1 && err.name == "no_db_file") {
            // create db
            DbOperations.create(Model, (err) => {
                if (err && err.name != "db_already_exists")
                    callback(err);
                else
                    _readId(Model, id, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else
            callback(undefined, new Model(result)); // document found!
    });
}

function _performReadId(Model, id, callback) {
    Model.scope.get(id, Err.resultFunc('doc', callback));
}

DocOperations.head = (doc, callback = ()=>{}) => {
    if (!doc || !doc.getId())
        callback(Err.missingId('doc'));
    else
        _head(doc, callback);
}

function _head(doc, callback) {
    DocOperations.headId(doc.constructor, doc.getId(), (err, rev, result) => {
        if (rev)
            doc._latestRev = rev;
        callback(err, rev, result);
    });
}

DocOperations.headId = (Model, id, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('doc', 'model'));
    else if (!Model.scope)
        callback(Err.missingNano());
    else if (!id)
        callback(Err.missingId('doc'));
    else
        _headId(Model, id, callback);
}

function _headId(Model, id, callback, tries = 0) {
    tries++;
    _performHeadId(Model, id, (err, rev, result) => {
        if (err && tries <= 1 && err.name == "no_db_file") {
            // create db
            DbOperations.create(Model, (err) => {
                if (err && err.name != "db_already_exists")
                    callback(err);
                else
                    _headId(Model, id, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else
            callback(undefined, rev, result); // success
    });
}

function _performHeadId(Model, id, callback) {
    // here we need the third parameter
    // not the second
    // the second seems empty...
    Model.scope.head(id, (raw, body, result) => {
        const err = Err.make('doc', raw);
        if (err)
            callback(err);
        else if (result['etag']) {
            // we have a new rev
            // nano puts it in the format '"etag"' so we need to
            // strip erroneous quotes
            callback(undefined, result['etag'].replace(/"/g, ""), result);
        }
        else
            callback(new Err('doc', "missing_rev", "Rev missing from header response."));
    });
}

DocOperations.create = (Model, body, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('doc', 'model'));
    else if (!Model.scope)
        callback(Err.missingNano());
    else if (!body)
        callback(Err.missingParam('doc', "body"));
    else
        _performWriteIdAndInstantiateDoc(Model, undefined, undefined, body, callback);
}

DocOperations.write = (doc, body, callback = ()=>{}) => {
    if (!doc.getId())
        callback(Err.missingId('doc'));
    else if (!body)
        callback(Err.missingParam('doc', "body"));
    else
        _write(doc, body, callback);
}

function _write(doc, body, callback, tries = 0) {
    tries++;
    const clone = deepExtend({}, body);
    _performWriteId(doc.constructor, doc.getId(), clone, (err, result) => {
        if (err && tries <= MAX_TRIES && err.name == "conflict") {
            DocOperations.head(doc, (err) => {
                if (err)
                    callback(err);
                else
                    _write(doc, body, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else {
            doc.body = clone;
            doc.body['_id'] = result['id'];
            doc.body['_rev'] = doc._latestRev = result['rev'];
            callback(); // success
        }
    });
}

DocOperations.update = (doc, body, callback = ()=>{}) => {
    if (!doc.getId())
        callback(Err.missingId('doc'));
    else if (!body)
        callback(Err.missingParam('doc', "body"));
    else
        _update(doc, body, callback);
}

function _update(doc, body, callback, tries = 0) {
    tries++;
    const clone = deepExtend({}, doc.body, body);
    _performUpdate(doc, clone, (err, result) => {
        if (err && tries <= MAX_TRIES && err.name == "conflict") {
            DocOperations.read(doc, (err) => {
                if (err)
                    callback(err);
                else
                    _update(doc, body, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else {
            doc.body = clone;
            doc.body['_id'] = result['id'];
            doc.body['_rev'] = doc._latestRev = result['rev'];
            callback(); // success
        }
    });
}

function _performUpdate(doc, body, callback) {
    if (doc.getRev() !== doc._latestRev)
        callback(Err.conflict('doc')); // we know we are out of date
    else
        _performWriteId(doc.constructor, doc.getId(), doc.getRev(), body, callback);
}

DocOperations.writeId = (Model, id, body, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('doc', 'model'));
    else if (!Model.scope)
        callback(Err.missingNano());
    else if (!id)
        callback(Err.missingId('doc'));
    else if (!body)
        callback(Err.missingParam('doc', "body"));
    else
        _writeId(Model, id, body, callback);
}

function _writeId(Model, id, body, callback, tries = 0) {
    tries++;
    DocOperations.headId(Model, id, (err, rev) => {
        _performWriteIdAndInstantiateDoc(Model, id, rev, body, (err, doc) => {
            if (err) {
                if (tries <= MAX_TRIES && err.name == "conflict")
                    _writeId(Model, id, body, callback, tries);
                else
                    callback(err);
            }
            else
                callback(undefined, doc); // successfully written
        });
    });
}

DocOperations.updateId = (Model, id, body, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('doc', 'model'));
    else if (!Model.scope)
        callback(Err.missingNano());
    else if (!id)
        callback(Err.missingId('doc'));
    else if (!body)
        callback(Err.missingParam('doc', "body"));
    else
        _updateId(Model, id, body, callback);
}

function _updateId(Model, id, body, callback) {
    DocOperations.readId(Model, id, (err, doc) => {
        if (err)
            callback(err);
        else {
            DocOperations.update(doc, body, (err) => {
                if (err)
                    callback(err);
                else
                    callback(undefined, doc); // successfully updated
            });
        }
    });
}

DocOperations.updateOrWriteId = (Model, id, body, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('doc', 'model'));
    else if (!Model.scope)
        callback(Err.missingNano());
    else if (!id)
        callback(Err.missingId('doc'));
    else if (!body)
        callback(Err.missingParam('doc', "body"));
    else
        _updateOrWriteId(Model, id, body, callback);
}

function _updateOrWriteId(Model, id, body, callback, tries = 0) {
    tries++;
    DocOperations.updateId(Model, id, body, (err, doc) => {
        if (err && err.name == "not_found") {
            _performWriteIdAndInstantiateDoc(Model, id, undefined, body, (err, doc) => {
                if (err && tries <= MAX_TRIES && err.name == "conflict") {
                    // document exists
                    _updateOrWriteId(Model, id, body, callback, tries);
                }
                else if (err)
                    callback(err);
                else
                    callback(undefined, doc); // successfully written
            });
        }
        else if (err)
            callback(err);
        else
            callback(undefined, doc); // successfully updated
    });
}

function _performWriteIdAndInstantiateDoc(Model, id, rev, body, callback, tries = 0) {
    tries++;
    const clone = deepExtend({}, body);
    _performWriteId(Model, id, rev, clone, (err, result) => {
        if (err && tries <= 1 && err.name == "no_db_file") {
            // create db
            DbOperations.create(Model, (err) => {
                if (err && err.name != "db_already_exists")
                    callback(err);
                else
                    _performWriteIdAndInstantiateDoc(Model, id, rev, body, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else
            callback(undefined, new Model(clone, result)); // written successfully
    });
}

function _performWriteId(Model, id, rev, body, callback) {
    body['_rev'] = rev;
    Model.scope.insert(body, id, Err.resultFunc('doc', callback));
}

DocOperations.destroy = (doc, id, callback = ()=>{}) => {
    if (!doc || !doc.getId())
        callback(Err.missingId('doc'));
    else if (!doc.constructor.nano)
        callback(Err.missingNano());
    else
        _destroy(doc, callback);
};

function _destroy(doc, callback, tries = 0) {
    tries++;
    _performDestroyId(doc.constructor, doc.getId(), (err) => {
        if (err && tries <= MAX_TRIES && err.name == "conflict") {
            DocDocOperations.head(doc, (err) => {
                if (err)
                    callback(err);
                else
                    _destroy(doc, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else {
            doc.body = {};
            callback(); // success
        }
    });
}

DocOperations.destroyId = (Model, id, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('doc', 'model'));
    else if (!Model.scope)
        callback(Err.missingNano());
    else if (!id)
        callback(Err.missingId('doc'));
    else
        _destroyId(Model, id, callback);
};

function _destroyId(Model, id, callback, tries = 0) {
    tries++;
    DocOperations.headId(Model, id, (err, rev) => {
        if (err)
            callback(err);
        else {
            _performDestroyId(Model, id, rev, (err) => {
                if (err && tries <= MAX_TRIES && err.name == "conflict")
                    _destroyId(Model, id, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(); // successfully destroyed
            });
        }
    });
}

function _performDestroyId(Model, id, rev, callback) {
    Model.scope.destroy(id, rev, Err.resultFunc('doc', callback));
}

module.exports = DocOperations;
