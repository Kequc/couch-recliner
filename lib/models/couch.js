'use strict';
const url = require('url');

const CouchOperations = require('../couch-operations');

class Couch {
    constructor(envs = {}) {
        this.envs = envs;
        this._ids = [];
    }

    get CACHE_IDS_COUNT() { return this._CACHE_IDS_COUNT || 10; }
    set CACHE_IDS_COUNT(value) {
        if (typeof value === 'number')
            this._CACHE_IDS_COUNT = value;
        else
            throw new Error('Invalid paramater CACHE_IDS_COUNT. ' + value);
    }

    get baseUrl() {
        return this._baseUrl || 'http://localhost:5984';
    }
    set envs(value) {
        if (typeof value !== 'object')
            throw new Error('Invalid parameter envs. ' + value);
        for (const env of Object.keys(value)) {
            if (typeof value[env] !== 'string')
                throw new Error('Invalid parameter envs. ' + value);
        }
        const env = process.env.NODE_ENV || 'development';
        this._baseUrl = value[env] || value['default'];
    }

    urlTo(...breadcrumbs) {
        const path = url.resolve(this.baseUrl, breadcrumbs.join('/'));
        if (breadcrumbs.filter(part => !part).length > 0)
            throw new Error('Invalid url. ' + path);
        return path;
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
