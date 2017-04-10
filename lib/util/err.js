'use strict';

function _getStatusCode(response = {}) {
    return response.statusCode || 500;
}

function _getBody(response = {}) {
    return response.body || {};
}

class Err {
    constructor(scope, name, message, raw = {}) {
        this.scope = scope;
        this.name = name || 'unknown_error';
        this.message = message || raw.message || 'No additional information available.';
        this.raw = raw;
    }

    toError() {
        const error = new Error(this.message);
        error.name = this.name;
        return error;
    }

    static checkOpsCouch(couch, params) {
        if (!couch)
            return Err.missingParam('couch');
        else
            return Err.checkParams(params);
    }

    static checkOpsFixed(doc, params) {
        if (!doc || !doc.id)
            return Err.missingParam('id');
        else
            return Err.checkParams(params);
    }

    static checkOps(Model, params) {
        if (!Model)
            return Err.missingParam('Model');
        else
            return Err.checkParams(params);
    }

    static checkParams(params = {}) {
        for (const key of Object.keys(params)) {
            if (!params[key])
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
            return new Err(scope, 'db_already_exists', 'Database already exists.', error);
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
    static verifyFailed() {
        return new Err('ops', 'verify_failed', 'Verify code mismatch.');
    }
    static missingRev() {
        return new Err('doc', 'missing_rev', 'No rev returned in header response.');
    }
}

module.exports = Err;
