'use strict';
const Err = require('./err');

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
