'use strict';
const Err = require('../models/err');
const DocMutator = require('../util/doc-mutator');
const Http = require('../util/http');
const Req = require('../util/req');
const Res = require('../util/res');

const FindMeta = {};

const _build = (Model, isPartial) => (body) =>
    DocMutator.build(Model, body, body._id, body._rev, (isPartial ? undefined : body._rev));

function _docs(Model, finder, docs = []) {
    const isPartial = finder.getFields() !== undefined;
    const build = _build(Model, isPartial);
    return docs.map(build);
}

FindMeta.findOne = (Model, finder, callback) => {
    const url = Req.urlTo(Model, '_find');
    const body = Object.assign(finder.forHttp(), { limit: 1 });
    Http.request(Req.post({ url, body }), Res.body('doc', (err, { docs }) => {
        const doc = _docs(Model, finder, docs)[0];
        if (err && err.name !== 'not_found')
            callback(err);
        else if (doc === undefined)
            callback(Err.missing('doc'));
        else
            callback(undefined, doc);
    }));
};

FindMeta.find = (Model, finder, callback) => {
    const url = Req.urlTo(Model, '_find');
    const body = finder.forHttp();
    Http.request(Req.post({ url, body }), Res.body('doc', (err, { docs }) => {
        if (err && err.name !== 'not_found')
            callback(err);
        else
            callback(undefined, _docs(Model, finder, docs));
    }));
};

module.exports = FindMeta;
