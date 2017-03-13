'use strict';
const needle = require('needle');

const Err = require('../err');

class Db {
    constructor (baseUrl, dbName, opt = {}) {
        this.baseUrl = baseUrl;
        this.dbName = _sanitiseDbName(dbName);
        this.MAX_TRIES = ('maxTries' in opt ? opt.maxTries : 5);
    }

    urlTo(...breadcrumbs) {
        if (breadcrumbs.includes(undefined))
            throw new Error('Invalid path supplied to db.');
        return [this.baseUrl, this.dbName].concat(breadcrumbs).join('/');
    }

    // read(id, callback) {
    //     const url = this.urlTo(id);
    //     CouchDb.get(url, undefined, Err.resultFunc('doc', callback));
    // }

    // readWithAttachments(id, callback) {
    //     const url = this.urlTo(id);
    //     const opt = {
    //         qs: { attachments: true }
    //     }
    //     CouchDb.get(url, opt, Err.resultFunc('doc', callback));
    // }

    // write(id, rev, body, callback) {
    //     const url = this.urlTo(id);
    //     const opt = {
    //         qs: { rev },
    //         body
    //     };
    //     CouchDb.put(url, opt, Err.resultFunc('doc', callback));
    // }

    // writeWithAttachments(id, rev, body, attachments, callback) {
    //     const url = this.urlTo(id);
    //     const opt = {
    //         qs: { rev },
    //         body,
    //         attachments
    //     };
    //     CouchDb.put(url, opt, Err.resultFunc('doc', callback));
    // }

    // destroy(id, rev, callback) {
    //     const url = this.urlTo(id);
    //     const opt = {
    //         qs: { rev }
    //     };
    //     CouchDb.delete(url, opt, Err.resultFunc('doc', callback));
    // }

    // head(id, callback) {
    //     const url = this.urlTo(id);
    //     CouchDb.head(url, undefined, Err.resultFunc('doc', callback));
    // }

    // show(design, name, id, params, callback) {
    //     const url = this.urlTo('_design', design, '_show', name, id);
    //     const opt = {
    //         qs: _sanitiseDesignParams(params)
    //     };
    //     CouchDb.get(url, opt, Err.resultFunc('show', callback));
    // }

    // view(design, name, params, callback) {
    //     const url = this.urlTo('_design', design, '_view', name);
    //     const opt = {
    //         qs: _sanitiseDesignParams(params)
    //     };
    //     CouchDb.get(url, opt, Err.resultFunc('view', callback));
    // }

    // readAttachment(id, name, callback) {
    //     const url = this.urlTo(id, name);
    //     return CouchDb.get(url, undefined, Err.resultFunc('attachment', callback));
    // }

    // writeAttachment(id, name, rev, body, contentType, callback) {
    //     const url = this.urlTo(id, name);
    //     const opt = {
    //         qs: { rev },
    //         body,
    //         contentType,
    //     };
    //     return CouchDb.put(url, opt, Err.resultFunc('attachment', callback));
    // }

    // destroyAttachment(id, name, rev, callback) {
    //     const url = this.urlTo(id, name);
    //     const opt = {
    //         qs: { rev }
    //     };
    //     CouchDb.delete(url, opt, Err.resultFunc('attachment', callback));
    // }

    // createDatabase(callback) {
    //     const url = this.urlTo();
    //     CouchDb.put(url, undefined, Err.resultFunc('db', callback));
    // }

    // destroyDatabase(callback) {
    //     const url = this.urlTo();
    //     CouchDb.delete(url, undefined, Err.resultFunc('db', callback));
    // }
}

function _sanitiseDbName(dbName) {
    const env = process.env.NODE_ENV || 'development';
    if (env !== 'production')
        return dbName + '-' + env;
    else
        return dbName;
}

function _sanitiseDesignParams(params) {
    const qs = Object.assign({}, params);
    for (const key of ['counts', 'drilldown', 'group_sort', 'ranges', 'sort']) {
        if (qs[key])
            qs[key] = JSON.stringify(qs[key]);
    }
    return qs;
}

module.exports = Db;
