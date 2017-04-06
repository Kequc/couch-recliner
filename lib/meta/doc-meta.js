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
    Http.request(options, Res.body('doc', (err, body) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err)
            callback(err);
        else {
            doc._body = BodyParser.forDoc(body);
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
    Http.request(options, Res.body('doc', (err, body) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err)
            callback(err);
        else
            callback(undefined, new Model(BodyParser.forDoc(body))); // success
    }));
};

DocMeta.headFixed = (doc, callback) => {
    const options = {
        method: 'HEAD',
        url: Http.urlToFixed(doc)
    };
    Http.request(options, Res.headers('doc', (err, headers) => {
        const rev = Res.findRev(headers);
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err)
            callback(err);
        else if (!rev)
            callback(Err.missingRev());
        else {
            doc._latestRev = rev;
            callback(undefined, rev); // success
        }
    }));
};

DocMeta.head = (Model, id, callback) => {
    const options = {
        method: 'HEAD',
        url: Http.urlTo(Model, id)
    };
    Http.request(options, Res.headers('doc', (err, headers) => {
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
    Http.multipart(options, merged, Res.body('doc', (err, body) => {
        if (err && tries <= 1 && err.name === 'no_db_file')
            DbMeta.createAndRetry(doc.constructor, callback)(DocMeta.writeFixed, doc, data, callback, tries);
        else if (err && tries <= doc.constructor.MAX_TRIES && err.name === 'conflict')
            DocMeta.headFixedAndRetry(doc, callback)(DocMeta.writeFixed, doc, data, callback, tries);
        else if (err)
            callback(err);
        else {
            doc._body = BodyParser.forDoc(merged);
            doc._body._id = body.id;
            doc._body._rev = doc._latestRev = body.rev;
            callback(); // success
        }
    }));
};

DocMeta.write = (Model, id, data, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        if (err && err.name !== 'not_found')
            callback(err);
        else {
            const options = {
                method: 'PUT',
                url: Http.urlTo(Model, id)
            };
            const merged = Object.assign({}, data, {
                _rev: rev
            });
            Http.multipart(options, merged, Res.body('doc', (err, body) => {
                if (err && tries <= 1 && err.name === 'no_db_file')
                    DbMeta.createAndRetry(Model, callback)(DocMeta.write, Model, id, data, callback, tries);
                else if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
                    DocMeta.write(Model, id, data, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(undefined, new Model(BodyParser.forDoc(merged), body)); // success
            }));
        }
    });
};

DocMeta.updateFixed = (doc, data, callback, tries = 0) => {
    tries++;
    // Don't accidentally create a new db record
    DocMeta.headFixed(doc, (err) => {
        if (err)
            callback(err);
        else if (doc._latestRev !== doc.rev)
            DocMeta.readFixedAndRetry(doc, callback)(DocMeta.updateFixed, doc, data, callback, tries);
        else {
            const options = {
                method: 'PUT',
                url: Http.urlToFixed(doc)
            };
            const merged = artisan({}, doc.body, data);
            Http.multipart(options, merged, Res.body('doc', (err, body) => {
                if (err && err.name === 'no_db_file')
                    callback(Err.missing('doc', err.raw));
                else if (err && tries <= doc.constructor.MAX_TRIES && err.name === 'conflict')
                    DocMeta.readFixedAndRetry(doc, callback)(DocMeta.updateFixed, doc, data, callback, tries);
                else if (err)
                    callback(err);
                else {
                    doc._body = BodyParser.forDoc(merged);
                    doc._body._id = body.id;
                    doc._body._rev = doc._latestRev = body.rev;
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
            Http.multipart(options, merged, Res.body('doc', (err, body) => {
                if (err && err.name === 'no_db_file')
                    callback(Err.missing('doc', err.raw));
                else if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
                    DocMeta.update(Model, id, data, callback, tries);
                else if (err)
                    callback(err);
                else {
                    doc._body = BodyParser.forDoc(merged);
                    doc._body._id = body.id;
                    doc._body._rev = doc._latestRev = body.rev;
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
            Http.multipart(options, merged, Res.body('doc', (err, body) => {
                if (err && tries <= 1 && err.name === 'no_db_file')
                    DbMeta.createAndRetry(Model, callback)(DocMeta.updateOrWrite, Model, id, data, callback, tries);
                else if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
                    DocMeta.updateOrWrite(Model, id, data, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(undefined, new Model(BodyParser.forDoc(merged), body)); // success
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
    Model.couch.getNextId((err, id) => {
        if (err)
            callback(err);
        else {
            const options = {
                method: 'PUT',
                url: Http.urlTo(Model, id)
            };
            const merged = Object.assign({}, data);
            delete data._id;
            delete data._rev;
            Http.multipart(options, merged, Res.body('doc', (err, body) => {
                if (err && tries <= 1 && err.name === 'no_db_file')
                    DbMeta.createAndRetry(Model, callback)(DocMeta.create, Model, data, callback, tries);
                else if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
                    DocMeta.create(Model, data, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(undefined, new Model(BodyParser.forDoc(merged), body)); // success
            }));
        }
    });
};

DocMeta.destroyFixed = (doc, callback, tries = 0) => {
    tries++;
    const options = {
        method: 'DELETE',
        url: Http.urlToFixed(doc),
        qs: { rev: doc._latestRev }
    };
    Http.request(options, Res.err('doc', (err) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err && tries <= doc.constructor.MAX_TRIES && err.name === 'conflict')
            DocMeta.headFixedAndRetry(doc, callback)(DocMeta.destroyFixed, doc, callback, tries);
        else if (err)
            callback(err);
        else {
            doc._body = {};
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
            Http.request(options, Res.err('doc', (err) => {
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

DocMeta.headFixedAndRetry = (doc, callback) => (retry, ...params) => {
    DocMeta.headFixed(doc, (err) => {
        if (err)
            callback(err);
        else
            retry(...params);
    });
};

DocMeta.readFixedAndRetry = (doc, callback) => (retry, ...params) => {
    DocMeta.readFixed(doc, (err) => {
        if (err)
            callback(err);
        else
            retry(...params);
    });
};

module.exports = DocMeta;
