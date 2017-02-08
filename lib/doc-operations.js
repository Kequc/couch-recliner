"use strict";
const deepExtend = require('deep-extend');

const DbOperations = require('./db-operations');
const Err = require('./err');

const MAX_TRIES = 5;

const DocOperations = {};

DocOperations.readDoc = (doc, callback = ()=>{}) => {
    if (!doc || !doc.getId())
        callback(Err.missingId('doc'));
    else if (!doc.constructor.nano)
        callback(Err.missingNano());
    else
        _readDoc(doc, callback);
};

DocOperations.read = (Model, id, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('doc', 'model'));
    else if (!Model.scope)
        callback(Err.missingNano());
    else if (!id)
        callback(Err.missingId('doc'));
    else
        _read(Model, id, callback);
};

function _readDoc(doc, callback) {
    _performRead(doc.constructor, doc.getId(), (err, result) => {
        if (err)
            callback(err);
        else {
            doc.body = result;
            doc._latestRev = result['_rev'];
            callback(); // up to date
        }
    });
}

function _read(Model, id, callback, tries = 0) {
    tries++;
    _performRead(Model, id, (err, result) => {
        if (err && tries <= 1 && err.name == "no_db_file") {
            // create db
            DbOperations.create(Model, (err) => {
                if (err && err.name != "db_already_exists")
                    callback(err);
                else
                    _read(Model, id, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else
            callback(undefined, new Model(result)); // document found!
    });
}

function _performRead(Model, id, callback) {
    Model.scope.get(id, Err.resultFunc('doc', callback));
}

DocOperations.headDoc = (doc, callback = ()=>{}) => {
    if (!doc || !doc.getId())
        callback(Err.missingId('doc'));
    else
        _headDoc(doc, callback);
}

function _headDoc(doc, callback) {
    DocOperations.headId(doc.constructor, doc.getId(), (err, rev, result) => {
        if (rev)
            doc._latestRev = rev;
        callback(err, rev, result);
    });
}

DocOperations.head = (Model, id, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('doc', 'model'));
    else if (!Model.scope)
        callback(Err.missingNano());
    else if (!id)
        callback(Err.missingId('doc'));
    else
        _head(Model, id, callback);
}

function _head(Model, id, callback, tries = 0) {
    tries++;
    _performHead(Model, id, (err, rev, result) => {
        if (err && tries <= 1 && err.name == "no_db_file") {
            // create db
            DbOperations.create(Model, (err) => {
                if (err && err.name != "db_already_exists")
                    callback(err);
                else
                    _head(Model, id, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else
            callback(undefined, rev, result); // success
    });
}

function _performHead(Model, id, callback) {
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
        _performWriteAndInstantiateDoc(Model, undefined, undefined, body, callback);
}

DocOperations.writeDoc = (doc, body, callback = ()=>{}) => {
    if (!doc.getId())
        callback(Err.missingId('doc'));
    else if (!body)
        callback(Err.missingParam('doc', "body"));
    else
        _writeDoc(doc, body, callback);
}

function _writeDoc(doc, body, callback, tries = 0) {
    tries++;
    const clone = deepExtend({}, body);
    _performWrite(doc.constructor, doc.getId(), clone, (err, result) => {
        if (err && tries <= MAX_TRIES && err.name == "conflict") {
            DocOperations.headDoc(doc, (err) => {
                if (err)
                    callback(err);
                else
                    _writeDoc(doc, body, callback, tries);
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

DocOperations.updateDoc = (doc, body, callback = ()=>{}) => {
    if (!doc.getId())
        callback(Err.missingId('doc'));
    else if (!body)
        callback(Err.missingParam('doc', "body"));
    else
        _updateDoc(doc, body, callback);
}

function _updateDoc(doc, body, callback, tries = 0) {
    tries++;
    const clone = deepExtend({}, doc.body, body);
    _performUpdateDoc(doc, clone, (err, result) => {
        if (err && tries <= MAX_TRIES && err.name == "conflict") {
            DocOperations.readDoc(doc, (err) => {
                if (err)
                    callback(err);
                else
                    _updateDoc(doc, body, callback, tries);
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

function _performUpdateDoc(doc, body, callback) {
    if (doc.getRev() !== doc._latestRev)
        callback(Err.conflict('doc')); // we know we are out of date
    else
        _performWrite(doc.constructor, doc.getId(), doc.getRev(), body, callback);
}

DocOperations.write = (Model, id, body, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('doc', 'model'));
    else if (!Model.scope)
        callback(Err.missingNano());
    else if (!id)
        callback(Err.missingId('doc'));
    else if (!body)
        callback(Err.missingParam('doc', "body"));
    else
        _write(Model, id, body, callback);
}

function _write(Model, id, body, callback, tries = 0) {
    tries++;
    DocOperations.head(Model, id, (err, rev) => {
        _performWriteAndInstantiateDoc(Model, id, rev, body, (err, doc) => {
            if (err) {
                if (tries <= MAX_TRIES && err.name == "conflict")
                    _write(Model, id, body, callback, tries);
                else
                    callback(err);
            }
            else
                callback(undefined, doc); // successfully written
        });
    });
}

DocOperations.update = (Model, id, body, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('doc', 'model'));
    else if (!Model.scope)
        callback(Err.missingNano());
    else if (!id)
        callback(Err.missingId('doc'));
    else if (!body)
        callback(Err.missingParam('doc', "body"));
    else
        _update(Model, id, body, callback);
}

function _update(Model, id, body, callback) {
    DocOperations.read(Model, id, (err, doc) => {
        if (err)
            callback(err);
        else {
            DocOperations.updateDoc(doc, body, (err) => {
                if (err)
                    callback(err);
                else
                    callback(undefined, doc); // successfully updated
            });
        }
    });
}

DocOperations.updateOrWrite = (Model, id, body, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('doc', 'model'));
    else if (!Model.scope)
        callback(Err.missingNano());
    else if (!id)
        callback(Err.missingId('doc'));
    else if (!body)
        callback(Err.missingParam('doc', "body"));
    else
        _updateOrWrite(Model, id, body, callback);
}

function _updateOrWrite(Model, id, body, callback, tries = 0) {
    tries++;
    DocOperations.update(Model, id, body, (err, doc) => {
        if (err && err.name == "not_found") {
            _performWriteAndInstantiateDoc(Model, id, undefined, body, (err, doc) => {
                if (err && tries <= MAX_TRIES && err.name == "conflict") {
                    // document exists
                    _updateOrWrite(Model, id, body, callback, tries);
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

function _performWriteAndInstantiateDoc(Model, id, rev, body, callback, tries = 0) {
    tries++;
    const clone = deepExtend({}, body);
    _performWrite(Model, id, rev, clone, (err, result) => {
        if (err && tries <= 1 && err.name == "no_db_file") {
            // create db
            DbOperations.create(Model, (err) => {
                if (err && err.name != "db_already_exists")
                    callback(err);
                else
                    _performWriteAndInstantiateDoc(Model, id, rev, body, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else
            callback(undefined, new Model(clone, result)); // written successfully
    });
}

function _performWrite(Model, id, rev, body, callback) {
    body['_rev'] = rev;
    Model.scope.insert(body, id, Err.resultFunc('doc', callback));
}

DocOperations.destroyDoc = (doc, id, callback = ()=>{}) => {
    if (!doc || !doc.getId())
        callback(Err.missingId('doc'));
    else if (!doc.constructor.nano)
        callback(Err.missingNano());
    else
        _destroyDoc(doc, callback);
};

function _destroyDoc(doc, callback, tries = 0) {
    tries++;
    _performDestroy(doc.constructor, doc.getId(), (err) => {
        if (err && tries <= MAX_TRIES && err.name == "conflict") {
            DocDocOperations.headDoc(doc, (err) => {
                if (err)
                    callback(err);
                else
                    _destroyDoc(doc, callback, tries);
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

DocOperations.destroy = (Model, id, callback = ()=>{}) => {
    if (!Model)
        callback(Err.missingParam('doc', 'model'));
    else if (!Model.scope)
        callback(Err.missingNano());
    else if (!id)
        callback(Err.missingId('doc'));
    else
        _destroy(Model, id, callback);
};

function _destroy(Model, id, callback, tries = 0) {
    tries++;
    DocOperations.head(Model, id, (err, rev) => {
        if (err)
            callback(err);
        else {
            _performDestroy(Model, id, rev, (err) => {
                if (err && tries <= MAX_TRIES && err.name == "conflict")
                    _destroy(Model, id, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(); // successfully destroyed
            });
        }
    });
}

function _performDestroy(Model, id, rev, callback) {
    Model.scope.destroy(id, rev, Err.resultFunc('doc', callback));
}

module.exports = DocOperations;
