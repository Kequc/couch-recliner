'use strict';
const needle = require('needle');
const artisan = require('json-artisan');

const DbMeta = require('./db-meta');
const Res = require('./res');
const Err = require('../err');

const MAX_TRIES = 5;

const DocMeta = {};

DocMeta.readFixed = (doc, callback) => {
    const url = doc.getDb().urlTo(doc.getId());
    needle.request('GET', url, {}, {}, Res.body('doc', (err, body) => {
        if (err)
            callback(err);
        else {
            doc.body = body;
            doc._latestRev = body._rev;
            callback(); // success
        }
    }));
};

DocMeta.read = (Model, id, callback, tries = 0) => {
    tries++;
    const url = Model.db.urlTo(id);
    needle.request('GET', url, {}, {}, Res.body('doc', (err, body) => {
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
            callback(undefined, new Model(body)); // success
    }));
};

DocMeta.headFixed = (doc, callback) => {
    const url = doc.getDb().urlTo(doc.getId());
    needle.request('HEAD', url, {}, {}, Res.headers('doc', (err, headers) => {
        const rev = Res.findRev(headers);
        if (err)
            callback(err);
        else if (!rev)
            callback(Err.missingRev());
        else {
            doc._latestRev = rev;
            callback(); // success
        }
    }));
};

DocMeta.head = (Model, id, callback, tries = 0) => {
    tries++;
    const url = Model.db.urlTo(id);
    needle.request('HEAD', url, {}, {}, Res.headers('doc', (err, headers) => {
        const rev = Res.findRev(headers);
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
            callback(Err.missingRev());
        else
            callback(undefined, rev); // success
    }));
};

DocMeta.writeFixed = (doc, data, callback, tries = 0) => {
    tries++;
    const url = doc.getDb().urlTo(doc.getId());
    const clone = Object.assign({}, data, { _rev: doc._latestRev });
    needle.request('PUT', url, clone, {}, Res.body('doc', (err, body) => {
        if (err && tries <= MAX_TRIES && err.name === 'conflict') {
            DocMeta.headFixed(doc, (err) => {
                if (err)
                    callback(err);
                else
                    DocMeta.writeFixed(doc, data, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else {
            doc.body = Object.assign({}, data);
            doc.body._id = body.id;
            doc.body._rev = doc._latestRev = body.rev;
            callback(); // success
        }
    }));
};

DocMeta.write = (Model, id, data, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        const url = Model.db.urlTo(id);
        const clone = Object.assign({}, data, { _rev: rev });
        needle.request('PUT', url, clone, {}, Res.body('doc', (err, body) => {
            if (err) {
                if (tries <= MAX_TRIES && err.name === 'conflict')
                    DocMeta.write(Model, id, data, callback, tries);
                else
                    callback(err);
            }
            else
                callback(undefined, new Model(data, body)); // success
        }));
    });
};

DocMeta.updateFixed = (doc, data, callback, tries = 0) => {
    tries++;
    const clone = artisan({}, doc.body, data);
    _writeFixedUnlessRevMismatch(doc, clone, (err, body) => {
        if (err && tries <= MAX_TRIES && err.name === 'conflict') {
            DocMeta.readFixed(doc, (err) => {
                if (err)
                    callback(err);
                else
                    DocMeta.updateFixed(doc, data, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else {
            doc.body = clone;
            doc.body._id = body.id;
            doc.body._rev = doc._latestRev = body.rev;
            callback(); // success
        }
    });
};

function _writeFixedUnlessRevMismatch(doc, data, callback) {
    if (doc.getRev() !== doc._latestRev)
        callback(Err.conflict('doc')); // we know we are out of date
    else {
        const url = doc.getDb().urlTo(doc.getId());
        needle.request('PUT', url, data, {}, Res.body('doc', callback));
    }
};

DocMeta.update = (Model, id, data, callback) => {
    DocMeta.read(Model, id, (err, doc) => {
        if (err)
            callback(err);
        else {
            DocMeta.updateFixed(doc, data, (err) => {
                if (err)
                    callback(err);
                else
                    callback(undefined, doc); // success
            });
        }
    });
};

DocMeta.updateOrWrite = (Model, id, data, callback, tries = 0) => {
    tries++;
    DocMeta.update(Model, id, data, (err, doc) => {
        if (err && err.name === 'not_found') {
            const url = Model.db.urlTo(id);
            needle.request('PUT', url, data, {}, Res.body('doc', (err, body) => {
                if (err && tries <= MAX_TRIES && err.name === 'conflict') {
                    // document exists
                    DocMeta.updateOrWrite(Model, id, data, callback, tries);
                }
                else if (err)
                    callback(err);
                else
                    callback(undefined, new Model(data, body)); // success
            }));
        }
        else if (err)
            callback(err);
        else
            callback(undefined, doc); // success
    });
};

DocMeta.create = (Model, data, callback, tries = 0) => {
    tries++;
    const url = Model.db.urlTo();
    needle.request('PUT', url, data, {}, Res.body('doc', (err, body) => {
        if (err && tries <= 1 && err.name === 'no_db_file') {
            // create db
            DbMeta.create(Model, (err) => {
                if (err && err.name != 'db_already_exists')
                    callback(err);
                else
                    DocMeta.create(Model, data, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else
            callback(undefined, new Model(data, body)); // success
    }));
};

DocMeta.destroyFixed = (doc, callback, tries = 0) => {
    tries++;
    const url = doc.getDb().urlTo(doc.getId());
    needle.request('DELETE', url, {}, { rev: doc._latestRev }, Res.err('doc', (err) => {
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
};

DocMeta.destroy = (Model, id, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        if (err)
            callback(err);
        else {
            const url = Model.db.urlTo(id);
            needle.request('DELETE', url, {}, { rev }, Res.err('doc', (err) => {
                if (err && tries <= MAX_TRIES && err.name === 'conflict')
                    DocMeta.destroy(Model, id, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(); // success
            }));
        }
    });
};

module.exports = DocMeta;
