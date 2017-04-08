'use strict';
const BodyParser = require('../util/body-parser');
const Err = require('../util/err');
const Http = require('../util/http');
const Req = require('../util/req');
const Res = require('../util/res');
const DbMeta = require('./db-meta');

const DocMeta = {};

DocMeta.readFixed = (doc, callback) => {
    const url = Req.urlToFixed(doc);
    Http.request(Req.get({ url }), Res.body('doc', (err, body) => {
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
    const url = Req.urlTo(Model, id);
    Http.request(Req.get({ url }), Res.body('doc', (err, body) => {
        if (err && err.name === 'no_db_file')
            callback(Err.missing('doc', err.raw));
        else if (err)
            callback(err);
        else
            callback(undefined, new Model(BodyParser.forDoc(body))); // success
    }));
};

DocMeta.headFixed = (doc, callback) => {
    const url = Req.urlToFixed(doc);
    Http.request(Req.head({ url }), Res.headers('doc', (err, headers) => {
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
    const url = Req.urlTo(Model, id);
    Http.request(Req.head({ url }), Res.headers('doc', (err, headers) => {
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
    const url = Req.urlToFixed(doc);
    const payload = Object.assign({}, data, { _rev: doc._latestRev });
    Http.request(Req.put({ url, payload }), Res.body('doc', (err, body) => {
        if (err && tries <= 1 && err.name === 'no_db_file') {
            DbMeta.create(doc.constructor, (err) => {
                if (err)
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
            doc._body = BodyParser.forDoc(payload);
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
            const url = Req.urlTo(Model, id);
            const payload = Object.assign({}, data, { _rev: rev });
            Http.request(Req.put({ url, payload }), Res.body('doc', (err, body) => {
                if (err && tries <= 1 && err.name === 'no_db_file') {
                    DbMeta.create(Model, (err) => {
                        if (err)
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
                    callback(undefined, new Model(BodyParser.forDoc(payload), body)); // success
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
        else if (doc._latestRev !== doc.rev) {
            DocMeta.readFixed(doc, (err) => {
                if (err)
                    callback(err);
                else
                    DocMeta.updateFixed(doc, data, callback, tries);
            });
        }
        else {
            const url = Req.urlToFixed(doc);
            const payload = BodyParser.extend(doc.body, data);
            Http.request(Req.put({ url, payload }), Res.body('doc', (err, body) => {
                if (err && err.name === 'no_db_file')
                    callback(Err.missing('doc', err.raw));
                else if (err && tries <= doc.constructor.MAX_TRIES && err.name === 'conflict') {
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
                    doc._body = BodyParser.forDoc(payload);
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
            const url = Req.urlTo(Model, id);
            const payload = BodyParser.extend(doc.body, data);
            Http.request(Req.put({ url, payload }), Res.body('doc', (err, body) => {
                if (err && err.name === 'no_db_file')
                    callback(Err.missing('doc', err.raw));
                else if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
                    DocMeta.update(Model, id, data, callback, tries);
                else if (err)
                    callback(err);
                else {
                    doc._body = BodyParser.forDoc(payload);
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
            const url = Req.urlTo(Model, id);
            const payload = Object.assign({}, data, { _rev: undefined });
            Http.request(Req.put({ url, payload }), Res.body('doc', (err, body) => {
                if (err && tries <= 1 && err.name === 'no_db_file') {
                    DbMeta.create(Model, (err) => {
                        if (err)
                            callback(err);
                        else
                            DocMeta.updateOrWrite(Model, id, data, callback, tries);
                    });
                }
                else if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
                    DocMeta.updateOrWrite(Model, id, data, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(undefined, new Model(BodyParser.forDoc(payload), body)); // success
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
            const url = Req.urlTo(Model, id);
            const payload = Object.assign({}, data, { _id: undefined, _rev: undefined });
            Http.request(Req.put({ url, payload }), Res.body('doc', (err, body) => {
                if (err && tries <= 1 && err.name === 'no_db_file') {
                    DbMeta.create(Model, (err) => {
                        if (err)
                            callback(err);
                        else
                            DocMeta.create(Model, data, callback, tries);
                    });
                }
                else if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
                    DocMeta.create(Model, data, callback, tries);
                else if (err)
                    callback(err);
                else
                    callback(undefined, new Model(BodyParser.forDoc(payload), body)); // success
            }));
        }
    });
};

DocMeta.destroyFixed = (doc, callback, tries = 0) => {
    tries++;
    const url = Req.urlToFixed(doc);
    const rev = doc._latestRev;
    Http.request(Req.delete({ url, qs: { rev } }), Res.err('doc', (err) => {
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
            const url = Req.urlTo(Model, id);
            Http.request(Req.delete({ url, qs: { rev } }), Res.err('doc', (err) => {
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
