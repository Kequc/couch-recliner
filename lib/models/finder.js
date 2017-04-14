'use strict';
const Err = require('./err');

function _isNumber(value, min = 0) {
    return typeof value === 'number' && value >= min;
}

function _isJson(value) {
    try { JSON.stringify(value); return true; }
    catch(e) { return false; }
}

function _isFields(value) {
    if (!Array.isArray(value)) return false;
    for (const field of value) {
        if (typeof field !== 'string') return false;
    }
    return true;
}

class Finder {
    constructor(opt) {
        if (typeof opt === 'object') {
            this.selector = opt.selector;
            this.limit = opt.limit;
            this.skip = opt.skip;
            this.sort = opt.sort;
            this.fields = opt.fields;
        }
    }

    static create(opt) {
        if (opt instanceof Finder) return opt;
        return new Finder(opt);
    }

    isValid() {
        if (this.selector === undefined || Array.isArray(this.selector) || !_isJson(this.selector)) return false;
        if (this.limit !== undefined && !_isNumber(this.limit, 1)) return false;
        if (this.skip !== undefined && !_isNumber(this.skip)) return false;
        if (this.sort !== undefined && (!Array.isArray(this.sort) || !_isJson(this.sort))) return false;
        if (this.fields !== undefined && !_isFields(this.fields)) return false;
        return true;
    }

    getFields() {
        if (this.fields === undefined) return undefined;
        return this.fields.concat('_id', '_rev');
    }

    forHttp() {
        return {
            selector: this.selector,
            fields: this.getFields(),
            sort: this.sort,
            limit: this.limit,
            skip: this.skip
        };
    }
}

module.exports = Finder;
