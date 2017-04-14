'use strict';
const Err = require('../models/err');
const DocMutator = require('../util/doc-mutator');
const Http = require('../util/http');
const Req = require('../util/req');
const Res = require('../util/res');

const FindMeta = {};

function _found(Model, bodies = []) {
    return bodies.map(body => DocMutator.build(Model, body, body._id, body._rev, undefined));
}

FindMeta.findOne = (Model, finder, callback) => {
    const url = Req.urlTo(Model, '_find');
    const body = Object.assign(finder.forHttp(), { limit: 1 });
    Http.request(Req.post({ url, body }), Res.body('doc', (err, { docs }) => {
        const doc = _found(Model, docs)[0];
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
            callback(undefined, _found(Model, docs));
    }));
};

module.exports = FindMeta;
