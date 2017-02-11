'use strict';
const deepExtend = require('deep-extend');

const DbMeta = require('./util/db-meta');
const MAX_TRIES = 5;

const DocMeta = {};

DocMeta.readFixed = (doc, callback) => {
    doc.getDb().read(doc.getId(), (err, result) => {
        if (err)
            callback(err);
        else {
            doc.body = result;
            doc._latestRev = result['_rev'];
            callback(); // up to date
        }
    });
}

DocMeta.read = (Model, id, callback, tries = 0) => {
    tries++;
    Model.db.read(id, (err, result) => {
        if (err && tries <= 1 && err.name === 'no_db_file') {
            // create db
            DbMeta.create(Model, (err) => {
                if (err && err.name != 'db_already_exists')
                    callback(err);
                else
                    DocMeta.read(Model, id, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else
            callback(undefined, new Model(result)); // document found!
    });
}

DocMeta.headFixed = (doc, callback) => {
    DocMeta.head(doc.constructor, doc.getId(), (err, rev, result) => {
        if (rev)
            doc._latestRev = rev;
        callback(err, rev, result);
    });
}

DocMeta.head = (Model, id, callback, tries = 0) => {
    tries++;
    Model.db.head(id, (err, rev, result) => {
        if (err && tries <= 1 && err.name === 'no_db_file') {
            // create db
            DbMeta.create(Model, (err) => {
                if (err && err.name != 'db_already_exists')
                    callback(err);
                else
                    DocMeta.head(Model, id, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else
            callback(undefined, rev, result); // success
    });
}

DocMeta.writeFixed = (doc, body, callback, tries = 0) => {
    tries++;
    const clone = deepExtend({}, body);
    doc.getDb().write(doc.getId(), clone, (err, result) => {
        if (err && tries <= MAX_TRIES && err.name === 'conflict') {
            DocMeta.headFixed(doc, (err) => {
                if (err)
                    callback(err);
                else
                    DocMeta.writeFixed(doc, body, callback, tries);
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

DocMeta.write = (Model, id, body, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        DocMeta.create(Model, id, rev, body, (err, doc) => {
            if (err) {
                if (tries <= MAX_TRIES && err.name === 'conflict')
                    DocMeta.write(Model, id, body, callback, tries);
                else
                    callback(err);
            }
            else
                callback(undefined, doc); // successfully written
        });
    });
}

DocMeta.updateFixed = (doc, body, callback, tries = 0) => {
    tries++;
    const clone = deepExtend({}, doc.body, body);
    _getDbWriteUnlessMismatch(doc, clone, (err, result) => {
        if (err && tries <= MAX_TRIES && err.name === 'conflict') {
            DocMeta.readFixed(doc, (err) => {
                if (err)
                    callback(err);
                else
                    DocMeta.updateFixed(doc, body, callback, tries);
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

function _getDbWriteUnlessMismatch(doc, body, callback) {
    if (doc.getRev() !== doc._latestRev)
        callback(Err.conflict('doc')); // we know we are out of date
    else
        doc.getDb().write(doc.getId(), doc.getRev(), body, callback);
}

DocMeta.update = (Model, id, body, callback) => {
    DocMeta.read(Model, id, (err, doc) => {
        if (err)
            callback(err);
        else {
            DocMeta.updateFixed(doc, body, (err) => {
                if (err)
                    callback(err);
                else
                    callback(undefined, doc); // successfully updated
            });
        }
    });
}

DocMeta.updateOrWrite = (Model, id, body, callback, tries = 0) => {
    tries++;
    DocMeta.update(Model, id, body, (err, doc) => {
        if (err && err.name === 'not_found') {
            DocMeta.create(Model, id, undefined, body, (err, doc) => {
                if (err && tries <= MAX_TRIES && err.name === 'conflict') {
                    // document exists
                    DocMeta.updateOrWrite(Model, id, body, callback, tries);
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

DocMeta.create = (Model, id, rev, body, callback, tries = 0) => {
    tries++;
    const clone = deepExtend({}, body);
    Model.db.write(id, rev, clone, (err, result) => {
        if (err && tries <= 1 && err.name === 'no_db_file') {
            // create db
            DbMeta.create(Model, (err) => {
                if (err && err.name != 'db_already_exists')
                    callback(err);
                else
                    DocMeta.create(Model, id, rev, body, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else
            callback(undefined, new Model(clone, result)); // written successfully
    });
}

DocMeta.destroyFixed = (doc, callback, tries = 0) => {
    tries++;
    doc.getDb().destroy(doc.getId(), (err) => {
        if (err && tries <= MAX_TRIES && err.name === 'conflict') {
            DocMeta.headFixed(doc, (err) => {
                if (err)
                    callback(err);
                else
                    DocMeta.destroyFixed(doc, callback, tries);
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

DocMeta.destroy = (Model, id, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        if (err)
            callback(err);
        else {
            Model.db.destroy(id, rev, (err) => {
                if (err && tries <= MAX_TRIES && err.name === 'conflict')
                    DocMeta.destroy(Model, id, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(); // successfully destroyed
            });
        }
    });
}

module.exports = DocMeta;
