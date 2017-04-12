'use strict';
const Err = require('./models/err');

const CouchOperations = require('./couch-operations');

class Couch {
    constructor(url) {
        this.url = url;
        this._ids = [];
    }

    get CACHE_IDS_COUNT() { return this._CACHE_IDS_COUNT || 10; }

    set CACHE_IDS_COUNT(value) {
        if (typeof value === 'number')
            this._CACHE_IDS_COUNT = value;
        else
            throw Err.invalidParameter('CACHE_IDS_COUNT').toError();
    }

    get url() {
        return this._url || 'http://localhost:5984';
    }

    set url(value) {
        if (value === undefined || typeof value === 'string')
            this._url = value;
        else
            throw Err.invalidParameter('url').toError();
    }

    urlTo(...breadcrumbs) {
        const url = [this.url].concat(breadcrumbs).join('/');
        if (breadcrumbs.filter(part => !part).length > 0)
            throw new Error('Invalid url. ' + url);
        return url;
    }

    getNextId(callback) {
        if (this._ids.length <= 0) {
            CouchOperations.uuid(this, this.CACHE_IDS_COUNT, (err, body) => {
                if (err)
                    callback(err);
                else {
                    this._ids = body;
                    callback(undefined, this._ids.shift()); // success
                }
            });
        }
        else
            callback(undefined, this._ids.shift());
    }
}

module.exports = Couch;
