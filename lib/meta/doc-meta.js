'use strict';
const Err = require('../models/err');
const DocMutator = require('../util/doc-mutator');
const Http = require('../util/http');
const Req = require('../util/req');
const Res = require('../util/res');
const CouchMeta = require('./couch-meta');
const DbMeta = require('./db-meta');

const DocMeta = {};

DocMeta.readFixed = (doc, callback) => {
    const url = Req.urlToFixed(doc);
    Http.request(Req.get({ url }), Res.body('doc', (err, body) => {
        if (err && err.name == 'not_found') {
            DocMutator.eraseLatestRev(doc);
            callback(err);
        }
        else if (err)
            callback(err);
        else {
            DocMutator.update(doc, body, body._rev, body._rev);
            callback(); // success
        }
    }));
};

DocMeta.read = (Model, id, callback) => {
    const url = Req.urlTo(Model, id);
    Http.request(Req.get({ url }), Res.body('doc', (err, body) => {
        if (err)
            callback(err);
        else {
            const doc = DocMutator.build(Model, body, body._id, body._rev, body._rev);
            callback(undefined, doc); // success
        }
    }));
};

DocMeta.headFixed = (doc, callback) => {
    const url = Req.urlToFixed(doc);
    Http.request(Req.head({ url }), Res.headers('doc', (err, headers) => {
        if (err && err.name == 'not_found') {
            DocMutator.eraseLatestRev(doc);
            callback(err);
        }
        else if (err)
            callback(err);
        else {
            const rev = Res.findRev(headers);
            DocMutator.updateLatestRev(doc, rev);
            callback(undefined, rev); // success
        }
    }));
};

DocMeta.head = (Model, id, callback) => {
    const url = Req.urlTo(Model, id);
    Http.request(Req.head({ url }), Res.headers('doc', (err, headers) => {
        const rev = Res.findRev(headers);
        if (err)
            callback(err);
        else if (!rev)
            callback(new Err('doc', 'missing_rev', 'No rev returned in header response.'));
        else
            callback(undefined, rev); // success
    }));
};

DocMeta.writeFixed = (doc, payload, callback, tries = 0) => {
    tries++;
    const url = Req.urlToFixed(doc);
    const rev = doc._latestRev;
    Http.request(Req.put({ url, payload, rev }), Res.body('doc', (err, body) => {
        if (err && tries <= 1 && err.name === 'not_found') {
            DbMeta.create(doc.constructor, (err) => {
                if (err)
                    callback(err);
                else
                    DocMeta.writeFixed(doc, payload, callback, tries);
            });
        }
        else if (err && tries <= doc.constructor.MAX_TRIES && err.name === 'conflict') {
            DocMeta.headFixed(doc, (err) => {
                if (err && err.name !== 'not_found')
                    callback(err);
                else
                    DocMeta.writeFixed(doc, payload, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else {
            DocMutator.update(doc, payload, body.rev, body.rev);
            callback(); // success
        }
    }));
};

DocMeta.write = (Model, id, payload, callback, tries = 0) => {
    tries++;
    DocMeta.head(Model, id, (err, rev) => {
        if (err && err.name !== 'not_found')
            callback(err);
        else {
            const url = Req.urlTo(Model, id);
            Http.request(Req.put({ url, payload, rev }), Res.body('doc', (err, body) => {
                if (err && tries <= 1 && err.name === 'not_found') {
                    DbMeta.create(Model, (err) => {
                        if (err)
                            callback(err);
                        else
                            DocMeta.write(Model, id, payload, callback, tries);
                    });
                }
                else if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
                    DocMeta.write(Model, id, payload, callback, tries);
                else if (err)
                    callback(err);
                else {
                    const doc = DocMutator.build(Model, payload, body.id, body.rev, body.rev);
                    callback(undefined, doc); // success
                }
            }));
        }
    });
};

DocMeta.updateFixed = (doc, payload, callback, tries = 0) => {
    tries++;
    if (doc.rev === undefined || doc._latestRev !== doc.rev) {
        DocMeta.readFixed(doc, (err) => {
            if (err)
                callback(err);
            else
                DocMeta.updateFixed(doc, payload, callback, tries);
        });
    }
    else {
        payload.extends = doc.body;
        const url = Req.urlToFixed(doc);
        const rev = doc.rev;
        Http.request(Req.put({ url, payload, rev }), Res.body('doc', (err, body) => {
            if (err && tries <= doc.constructor.MAX_TRIES && err.name === 'conflict') {
                DocMeta.readFixed(doc, (err) => {
                    if (err)
                        callback(err);
                    else
                        DocMeta.updateFixed(doc, payload, callback, tries);
                });
            }
            else if (err && err.name == 'not_found') {
                doc._latestRev = undefined;
                callback(err);
            }
            else if (err)
                callback(err);
            else {
                DocMutator.update(doc, payload, body.rev, body.rev);
                callback(); // success
            }
        }));
    }
};

DocMeta.update = (Model, id, payload, callback, tries = 0) => {
    tries++;
    DocMeta.read(Model, id, (err, doc) => {
        if (err)
            callback(err);
        else {
            payload.extends = doc.body;
            const url = Req.urlTo(Model, id);
            const rev = doc.rev;
            Http.request(Req.put({ url, payload, rev }), Res.body('doc', (err, body) => {
                if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
                    DocMeta.update(Model, id, payload, callback, tries);
                else if (err)
                    callback(err);
                else {
                    DocMutator.update(doc, payload, body.rev, body.rev);
                    callback(undefined, doc); // success
                }
            }));
        }
    });
};

DocMeta.updateOrWrite = (Model, id, payload, callback, tries = 0) => {
    tries++;
    DocMeta.update(Model, id, payload, (err, doc) => {
        if (err && err.name === 'not_found') {
            const url = Req.urlTo(Model, id);
            Http.request(Req.put({ url, payload }), Res.body('doc', (err, body) => {
                if (err && tries <= 1 && err.name === 'not_found') {
                    DbMeta.create(Model, (err) => {
                        if (err)
                            callback(err);
                        else
                            DocMeta.updateOrWrite(Model, id, payload, callback, tries);
                    });
                }
                else if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
                    DocMeta.updateOrWrite(Model, id, payload, callback, tries);
                else if (err)
                    callback(err);
                else {
                    const doc = DocMutator.build(Model, payload, body.id, body.rev, body.rev);
                    callback(undefined, doc); // success
                }
            }));
        }
        else if (err)
            callback(err);
        else
            callback(undefined, doc); // success
    });
};

DocMeta.create = (Model, payload, callback, tries = 0) => {
    tries++;
    CouchMeta.nextId(Model.couch, (err, id) => {
        if (err)
            callback(err);
        else {
            const url = Req.urlTo(Model, id);
            Http.request(Req.put({ url, payload }), Res.body('doc', (err, body) => {
                if (err && tries <= 1 && err.name === 'not_found') {
                    DbMeta.create(Model, (err) => {
                        if (err)
                            callback(err);
                        else
                            DocMeta.create(Model, payload, callback, tries);
                    });
                }
                else if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
                    DocMeta.create(Model, payload, callback, tries);
                else if (err)
                    callback(err);
                else {
                    const doc = DocMutator.build(Model, payload, body.id, body.rev, body.rev);
                    callback(undefined, doc); // success
                }
            }));
        }
    });
};

DocMeta.destroyFixed = (doc, callback, tries = 0) => {
    tries++;
    const url = Req.urlToFixed(doc);
    const rev = doc._latestRev;
    Http.request(Req.delete({ url, qs: { rev } }), Res.err('doc', (err) => {
        if (err && tries <= doc.constructor.MAX_TRIES && err.name === 'conflict') {
            DocMeta.headFixed(doc, (err) => {
                if (err)
                    callback(err);
                else
                    DocMeta.destroyFixed(doc, callback, tries);
            });
        }
        else if (err && err.name == 'not_found') {
            DocMutator.eraseLatestRev(doc);
            callback(err);
        }
        else if (err)
            callback(err);
        else {
            DocMutator.erase(doc);
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
                if (err && tries <= Model.MAX_TRIES && err.name === 'conflict')
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
