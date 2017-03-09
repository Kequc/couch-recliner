'use strict';
const needle = require('needle');
const artisan = require('json-artisan');

const DbMeta = require('./db-meta');
const MAX_TRIES = 5;

const DocMeta = {};

function _findRev(res) {
    // couchdb puts our rev in the format '"etag"' so we need to
    // strip erroneous quotes
    if (!res)
        return;
    if (res.body.rev || res.body._rev)
        return res.body.rev || res.body._rev;
    if (res.headers.etag)
        return res.headers.etag.replace(/"/g, '');
}

DocMeta.readFixed = (doc, callback) => {
    const url = doc.getDb().urlTo(doc.getId());
    needle.request('GET', url, {}, {}, Err.resultFunc('doc', (err, res) => {
        if (err)
            callback(err);
        else {
            doc.body = res.body;
            doc._latestRev = res.body._rev;
            callback(); // up to date
        }
    }));
}

DocMeta.read = (Model, id, callback, tries = 0) => {
    tries++;
    const url = Model.db.urlTo(id);
    needle.request('GET', url, {}, {}, Err.resultFunc('doc', (err, res) => {
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
            callback(undefined, new Model(res.body)); // document found!
    }));
}

DocMeta.headFixed = (doc, callback) => {
    const url = doc.getDb().urlTo(doc.getId());
    needle.request('HEAD', url, {}, {}, Err.resultFunc('doc', (err, res) => {
        const rev = _findRev(res);
        if (err)
            callback(err);
        else if (!rev)
            callback(Err.missingRev())
        else {
            doc._latestRev = rev;
            callback(err, rev, res.headers);
        }
    }));
}

DocMeta.head = (Model, id, callback, tries = 0) => {
    tries++;
    const url = Model.db.urlTo(id);
    needle.request('HEAD', url, {}, {}, Err.resultFunc('doc', (err, res) => {
        const rev = _findRev(res);
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
        else if (!rev)
            callback(Err.missingRev())
        else
            callback(undefined, rev, res.headers); // success
    }));
}

DocMeta.writeFixed = (doc, body, callback, tries = 0) => {
    tries++;
    const url = doc.getDb().urlTo(doc.getId());
    const data = Object.assign({}, body, { _rev: doc._latestRev });
    needle.request('PUT', url, data, {}, Err.resultFunc('doc', (err, res) => {
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
            doc.body = Object.assign({}, body);
            doc.body._id = res.body.id;
            doc.body._rev = doc._latestRev = res.body.rev;
            callback(); // success
        }
    }));
}

DocMeta.write = (Model, id, body, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        const url = Model.db.urlTo(id);
        const data = Object.assign({}, body, { _rev: rev });
        needle.request('PUT', url, data, {}, Err.resultFunc('doc', (err, res) => {
            if (err) {
                if (tries <= MAX_TRIES && err.name === 'conflict')
                    DocMeta.write(Model, id, body, callback, tries);
                else
                    callback(err);
            }
            else
                callback(undefined, new Model(body, res.body)); // successfully written
        }));
    });
}

DocMeta.updateFixed = (doc, body, callback, tries = 0) => {
    tries++;
    const data = artisan({}, doc.body, body);
    _updateFixedUnlessRevMismatch(doc, data, (err, res) => {
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
            doc.body = data;
            doc.body._id = res.body.id;
            doc.body._rev = doc._latestRev = res.body.rev;
            callback(); // success
        }
    });
}

function _writeFixedUnlessRevMismatch(doc, body, callback) {
    if (doc.getRev() !== doc._latestRev)
        callback(Err.conflict('doc')); // we know we are out of date
    else {
        const url = doc.getDb().urlTo(doc.getId());
        needle.request('PUT', url, body, {}, Err.resultFunc('doc', callback));
    }
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
            const url = Model.db.urlTo(id);
            needle.request('PUT', url, body, {}, Err.resultFunc('doc', (err, res) => {
                if (err && tries <= MAX_TRIES && err.name === 'conflict') {
                    // document exists
                    DocMeta.updateOrWrite(Model, id, body, callback, tries);
                }
                else if (err)
                    callback(err);
                else
                    callback(undefined, doc); // successfully written
            }));
        }
        else if (err)
            callback(err);
        else
            callback(undefined, doc); // successfully updated
    });
}

DocMeta.create = (Model, body, callback, tries = 0) => {
    tries++;
    const url = Model.db.urlTo();
    needle.request('PUT', url, body, {}, Err.resultFunc('doc', (err, res) => {
        if (err && tries <= 1 && err.name === 'no_db_file') {
            // create db
            DbMeta.create(Model, (err) => {
                if (err && err.name != 'db_already_exists')
                    callback(err);
                else
                    DocMeta.create(Model, body, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else
            callback(undefined, new Model(body, res.body)); // written successfully
    }));
}

DocMeta.destroyFixed = (doc, callback, tries = 0) => {
    tries++;
    const url = doc.getDb().urlTo(doc.getId());
    needle.request('DELETE', url, {}, { rev: doc._latestRev }, Err.resultFunc('doc', (err, res) => {
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
    }));
}

DocMeta.destroy = (Model, id, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        if (err)
            callback(err);
        else {
            const url = Model.db.urlTo(id);
            needle.request('DELETE', url, {}, { rev }, Err.resultFunc('doc', (err, res) => {
                if (err && tries <= MAX_TRIES && err.name === 'conflict')
                    DocMeta.destroy(Model, id, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(); // successfully destroyed
            }));
        }
    });
}

module.exports = DocMeta;
