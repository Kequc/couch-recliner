'use strict';
const needle = require('needle');
const artisan = require('json-artisan');

const DbMeta = require('./db-meta');
const Res = require('./res');
const Err = require('../err');
const BodyParser = require('../util/body-parser');

const DocMeta = {};

DocMeta.readFixed = (doc, callback) => {
    const url = doc.getDb().urlTo(doc.getId());
    needle.request('GET', url, {}, { json: true }, Res.body('doc', (err, body) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err)
            callback(err);
        else {
            doc.body = BodyParser.sanitise(body);
            doc._latestRev = body._rev;
            callback(); // success
        }
    }));
};

DocMeta.read = (Model, id, callback) => {
    const url = Model.db.urlTo(id);
    needle.request('GET', url, {}, { json: true }, Res.body('doc', (err, body) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err)
            callback(err);
        else
            callback(undefined, new Model(body)); // success
    }));
};

DocMeta.headFixed = (doc, callback) => {
    const url = doc.getDb().urlTo(doc.getId());
    needle.request('HEAD', url, {}, { json: true }, Res.headers('doc', (err, headers) => {
        const rev = Res.findRev(headers);
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err)
            callback(err);
        else if (!rev)
            callback(Err.missingRev());
        else {
            doc._latestRev = rev;
            callback(); // success
        }
    }));
};

DocMeta.head = (Model, id, callback) => {
    const url = Model.db.urlTo(id);
    needle.request('HEAD', url, {}, { json: true }, Res.headers('doc', (err, headers) => {
        const rev = Res.findRev(headers);
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
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
    const parsed = BodyParser.parse(clone);
    const opt = { json: true, multipart: parsed.multipart };
    needle.request('PUT', url, parsed.data, opt, Res.body('doc', (err, body) => {
        if (err && tries <= 1 && err.name === 'no_db_file') {
            // create db
            DbMeta.create(doc.constructor, (err) => {
                if (err && err.name !== 'db_already_exists')
                    callback(err);
                else
                    DocMeta.writeFixed(doc, data, callback, tries);
            });
        }
        else if (err && tries <= doc.getDb().MAX_TRIES && err.name === 'conflict') {
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
            doc.body = BodyParser.sanitise(clone);
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
        const parsed = BodyParser.parse(clone);
        const opt = { json: true, multipart: parsed.multipart };
        needle.request('PUT', url, parsed.data, opt, Res.body('doc', (err, body) => {
            if (err && tries <= 1 && err.name === 'no_db_file') {
                // create db
                DbMeta.create(Model, (err) => {
                    if (err && err.name !== 'db_already_exists')
                        callback(err);
                    else
                        DocMeta.write(Model, id, data, callback, tries);
                });
            }
            else if (err && tries <= Model.db.MAX_TRIES && err.name === 'conflict')
                DocMeta.write(Model, id, data, callback, tries);
            else if (err)
                callback(err);
            else
                callback(undefined, new Model(clone, body)); // success
        }));
    });
};

DocMeta.updateFixed = (doc, data, callback, tries = 0) => {
    tries++;
    DocMeta.readFixed(doc, (err) => {
        if (err)
            callback(err);
        else {
            const url = doc.getDb().urlTo(doc.getId());
            const merged = artisan({}, doc.body, data);
            const parsed = BodyParser.parse(merged);
            const opt = { json: true, multipart: parsed.multipart };
            needle.request('PUT', url, parsed.data, opt, Res.body('doc', (err, body) => {
                if (err && err.name === 'no_db_file')
                    callback(Err.missing('doc', err.raw));
                else if (err && tries <= doc.getDb().MAX_TRIES && err.name === 'conflict')
                    DocMeta.updateFixed(doc, data, callback, tries);
                else if (err)
                    callback(err);
                else {
                    doc.body = BodyParser.sanitise(merged);
                    doc.body._id = body.id;
                    doc.body._rev = doc._latestRev = body.rev;
                    callback(); // success
                }
            }));
        }
    });
};

DocMeta.update = (Model, id, data, callback, tries = 0) => {
    tries++;
    DocMeta.read(Model, id, (err, doc) => {
        if (err)
            callback(err);
        else {
            const url = Model.db.urlTo(id);
            const merged = artisan({}, doc.body, data);
            const parsed = BodyParser.parse(merged);
            const opt = { json: true, multipart: parsed.multipart };
            needle.request('PUT', url, parsed.data, opt, Res.body('doc', (err, body) => {
                if (err && err.name === 'no_db_file')
                    callback(Err.missing('doc', err.raw));
                else if (err && tries <= Model.db.MAX_TRIES && err.name === 'conflict')
                    DocMeta.update(Model, id, data, callback, tries);
                else if (err)
                    callback(err);
                else {
                    doc.body = BodyParser.sanitise(merged);
                    doc.body._id = body.id;
                    doc.body._rev = doc._latestRev = body.rev;
                    callback(undefined, doc); // success
                }
            }));
        }
    });
};

DocMeta.updateOrWrite = (Model, id, data, callback, tries = 0) => {
    tries++;
    DocMeta.update(Model, id, data, (err, doc) => {
        if (err && err.name === 'not_found') {
            const url = Model.db.urlTo(id);
            const clone = Object.assign({}, data, { _rev: undefined });
            const parsed = BodyParser.parse(clone);
            const opt = { json: true, multipart: parsed.multipart };
            needle.request('PUT', url, parsed.data, opt, Res.body('doc', (err, body) => {
                if (err && tries <= 1 && err.name === 'no_db_file') {
                    // create db
                    DbMeta.create(Model, (err) => {
                        if (err && err.name !== 'db_already_exists')
                            callback(err);
                        else
                            DocMeta.updateOrWrite(Model, id, data, callback, tries);
                    });
                }
                else if (err && tries <= Model.db.MAX_TRIES && err.name === 'conflict') {
                    // document exists
                    DocMeta.updateOrWrite(Model, id, data, callback, tries);
                }
                else if (err)
                    callback(err);
                else
                    callback(undefined, new Model(clone, body)); // success
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
    const clone = Object.assign({}, data, { _rev: undefined });
    const parsed = BodyParser.parse(clone);
    const opt = { json: true, multipart: parsed.multipart };
    needle.request('POST', url, parsed.data, opt, Res.body('doc', (err, body) => {
        if (err && tries <= 1 && err.name === 'no_db_file') {
            // create db
            DbMeta.create(Model, (err) => {
                if (err && err.name !== 'db_already_exists')
                    callback(err);
                else
                    DocMeta.create(Model, data, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else
            callback(undefined, new Model(clone, body)); // success
    }));
};

DocMeta.destroyFixed = (doc, callback, tries = 0) => {
    tries++;
    const url = doc.getDb().urlTo(doc.getId()) + '?rev=' + doc._latestRev;
    needle.request('DELETE', url, {}, { json: true }, Res.err('doc', (err) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err && tries <= doc.getDb().MAX_TRIES && err.name === 'conflict') {
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
            doc._latestRev = undefined;
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
            const url = Model.db.urlTo(id) + '?rev=' + rev;
            needle.request('DELETE', url, {}, {}, Res.err('doc', (err) => {
                if (err && err.name === 'no_db_file')
                    callback(Err.missing('doc', err.raw));
                else if (err && tries <= Model.db.MAX_TRIES && err.name === 'conflict')
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
