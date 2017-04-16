'use strict';

function _getStatusCode(response = {}) {
    return response.statusCode || 500;
}

function _getBody(response = {}) {
    return response.body || {};
}

function _isModel(Model) {
    return Model !== undefined && typeof Model.dbName === 'string' && Model.couch !== undefined;
}

class Err {
    constructor(scope, name, message, raw = {}) {
        this.scope = scope;
        this.name = name || 'unknown_error';
        this.message = message || raw.message || 'No additional information available.';
        this.raw = raw;
    }

    static checkOpsFixed(doc, params) {
        if (doc === undefined)
            return Err.missingParam('doc');
        if (!_isModel(doc.constructor))
            return Err.invalidParam('doc');
        if (doc.id === undefined)
            return Err.missingParam('id');
        return Err.checkParams(params);
    }

    static checkOps(Model, params) {
        if (Model === undefined)
            return Err.missingParam('Model');
        if (!_isModel(Model))
            return Err.invalidParam('Model');
        return Err.checkParams(params);
    }

    static checkParams(params = {}) {
        for (const key of Object.keys(params)) {
            if (params[key] === undefined)
                return Err.missingParam(key);
        }
    }

    static make(scope, error, response) {
        const statusCode = _getStatusCode(response);
        const body = _getBody(response);

        if (statusCode >= 200 && statusCode < 400 && !body.error) {
            // no problem
            return;
        }
        if (statusCode === 412) {
            // database create requested when database exists
            return new Err(scope, 'db_already_exists', 'Database already exists.', error || body);
        }
        if (statusCode === 404) {
            // something missing
            return this.missing(scope, error || body);
        }
        if (statusCode === 500 && body.error == '{not_found,missing}') {
            // couchdb incorrectly formatted error
            return this.missing(scope, error || { error: 'not_found' });
        }
        if (statusCode === 409) {
            // revision mismatch
            return this.conflict(scope, error || body);
        }

        // best guess!
        return new Err(scope, body.error, body.reason, error || body);
    }

    // common ones
    static missing(scope, err) {
        return new Err(scope, 'not_found', 'Not found.', err);
    }
    static missingParam(name) {
        const cName = name[0].toUpperCase() + name.slice(1);
        return new Err('ops', 'missing_param', cName + ' parameter required.');
    }
    static invalidParam(name) {
        return new Err('ops', 'invalid_param', 'Invalid ' + name + ' parameter supplied.');
    }
    static conflict(scope, err) {
        return new Err(scope, 'conflict', 'There was a conflict.', err);
    }
}

module.exports = Err;
