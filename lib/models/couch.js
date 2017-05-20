'use strict';
const url = require('url');

class Couch {
    constructor(envs) {
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
        return this._envs.url || 'http://localhost:5984';
    }

    set envs(value = {}) {
        if (typeof value === 'string')
            value = { url: value };
        if (typeof value !== 'object')
            throw new Error('Invalid parameter envs. ' + value);
        if (value.url !== undefined) {
            if (typeof value.url !== 'string' || !/^http(?:s)?(?::\/\/)/.test(value.url))
                throw new Error('Invalid url. ' + value.url);
        }
        this._envs = value;
    }

    urlTo(...breadcrumbs) {
        const path = url.resolve(this.baseUrl, breadcrumbs.join('/'));
        if (breadcrumbs.filter(part => !part).length > 0)
            throw new Error('Invalid url. ' + path);
        return path;
    }
}

module.exports = Couch;
