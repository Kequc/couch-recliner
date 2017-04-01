'use strict';
const artisan = require('json-artisan');

const BodyParser = require('../util/body-parser');
const Err = require('../util/err');
const Http = require('../util/http');
const Res = require('../util/res');
const DbMeta = require('./db-meta');

const DocMeta = {};

DocMeta.readFixed = (doc, callback) => {
    const options = {
        method: 'GET',
        url: Http.urlToFixed(doc)
    };
    Http.rawRequest(options, Res.body('doc', (err, body) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err)
            callback(err);
        else {
            doc.body = BodyParser.forDoc(body);
            doc._latestRev = body._rev;
            callback(); // success
        }
    }));
};

DocMeta.read = (Model, id, callback) => {
    const options = {
        method: 'GET',
        url: Http.urlTo(Model, id)
    };
    Http.rawRequest(options, Res.body('doc', (err, body) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err)
            callback(err);
        else
            callback(undefined, new Model(body)); // success
    }));
};

DocMeta.headFixed = (doc, callback) => {
    const options = {
        method: 'HEAD',
        url: Http.urlToFixed(doc)
    };
    Http.rawRequest(options, Res.headers('doc', (err, headers) => {
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
    const options = {
        method: 'HEAD',
        url: Http.urlTo(Model, id)
    };
    Http.rawRequest(options, Res.headers('doc', (err, headers) => {
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
    const options = {
        method: 'PUT',
        url: Http.urlToFixed(doc)
    };
    const merged = Object.assign({}, data, {
        _rev: doc._latestRev
    });
    Http.multipartRequest(options, merged, Res.body('doc', (err, body) => {
        if (err && tries <= 1 && err.name === 'no_db_file') {
            // create db
            DbMeta.create(doc.constructor, (err) => {
                if (err && err.name !== 'db_already_exists')
                    callback(err);
                else
                    DocMeta.writeFixed(doc, data, callback, tries);
            });
        }
        else if (err && tries <= doc.constructor.MAX_TRIES && err.name === 'conflict') {
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
            doc.body = BodyParser.forDoc(merged);
            doc.body._id = body.id;
            doc.body._rev = doc._latestRev = body.rev;
            callback(); // success
        }
    }));
};

DocMeta.write = (Model, id, data, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        const options = {
            method: 'PUT',
            url: Http.urlTo(Model, id)
        };
        const merged = Object.assign({}, data, {
            _rev: rev
        });
        Http.multipartRequest(options, merged, Res.body('doc', (err, body) => {
            if (err && tries <= 1 && err.name === 'no_db_file') {
                // create db
                DbMeta.create(Model, (err) => {
                    if (err && err.name !== 'db_already_exists')
                        callback(err);
                    else
                        DocMeta.write(Model, id, data, callback, tries);
                });
            }
            else if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
                DocMeta.write(Model, id, data, callback, tries);
            else if (err)
                callback(err);
            else
                callback(undefined, new Model(merged, body)); // success
        }));
    });
};

DocMeta.updateFixed = (doc, data, callback, tries = 0) => {
    tries++;
    DocMeta.readFixed(doc, (err) => {
        if (err)
            callback(err);
        else {
            const options = {
                method: 'PUT',
                url: Http.urlToFixed(doc)
            };
            const merged = artisan({}, doc.body, data);
            Http.multipartRequest(options, merged, Res.body('doc', (err, body) => {
                if (err && err.name === 'no_db_file')
                    callback(Err.missing('doc', err.raw));
                else if (err && tries <= doc.constructor.MAX_TRIES && err.name === 'conflict')
                    DocMeta.updateFixed(doc, data, callback, tries);
                else if (err)
                    callback(err);
                else {
                    doc.body = BodyParser.forDoc(merged);
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
            const options = {
                method: 'PUT',
                url: Http.urlTo(Model, id)
            };
            const merged = artisan({}, doc.body, data);
            Http.multipartRequest(options, merged, Res.body('doc', (err, body) => {
                if (err && err.name === 'no_db_file')
                    callback(Err.missing('doc', err.raw));
                else if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
                    DocMeta.update(Model, id, data, callback, tries);
                else if (err)
                    callback(err);
                else {
                    doc.body = BodyParser.forDoc(merged);
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
            const options = {
                method: 'PUT',
                url: Http.urlTo(Model, id)
            };
            const merged = Object.assign({}, data, {
                _rev: undefined
            });
            Http.multipartRequest(options, merged, Res.body('doc', (err, body) => {
                if (err && tries <= 1 && err.name === 'no_db_file') {
                    // create db
                    DbMeta.create(Model, (err) => {
                        if (err && err.name !== 'db_already_exists')
                            callback(err);
                        else
                            DocMeta.updateOrWrite(Model, id, data, callback, tries);
                    });
                }
                else if (err && tries <= Model.MAX_TRIES && err.name === 'conflict') {
                    // document exists
                    DocMeta.updateOrWrite(Model, id, data, callback, tries);
                }
                else if (err)
                    callback(err);
                else
                    callback(undefined, new Model(merged, body)); // success
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
    const options = {
        method: 'POST',
        url: Http.urlTo(Model)
    };
    const merged = Object.assign({}, data, {
        _rev: undefined
    });
    Http.multipartRequest(options, merged, Res.body('doc', (err, body) => {
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
            callback(undefined, new Model(merged, body)); // success
    }));
};

DocMeta.destroyFixed = (doc, callback, tries = 0) => {
    tries++;
    const options = {
        method: 'DELETE',
        url: Http.urlToFixed(doc),
        qs: { rev: doc._latestRev }
    };
    Http.rawRequest(options, Res.err('doc', (err) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err && tries <= doc.constructor.MAX_TRIES && err.name === 'conflict') {
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
            const options = {
                method: 'DELETE',
                url: Http.urlTo(Model, id),
                qs: { rev }
            };
            Http.rawRequest(options, Res.err('doc', (err) => {
                if (err && err.name === 'no_db_file')
                    callback(Err.missing('doc', err.raw));
                else if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
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
