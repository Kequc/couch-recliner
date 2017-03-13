/* class Err
 *
 * This is a utility class for manufacturing errors returned from couchdb
 * into a more structured format. Calling `make` and delivering the
 * original error should result in something sane.
 *
 * This is used internally as well as delivered to the user it acts as
 * a sanity check for chouchdb erros.
 *
 */
'use strict';

class Err {
    constructor(scope, name, message, raw) {
        this.scope = scope;
        this.name = name || 'unknown_error';
        this.message = message || 'No additional information available.';
        this.raw = raw || {};
    }

    static checkOpsFixed(doc, params) {
        if (!doc || !doc.getId())
            return Err.missingId();
        else if (!doc.getDb())
            return Err.missingDb();
        else
            return Err.checkParams(params);
    }

    static checkOps(Model, params) {
        if (!Model)
            return Err.missingParam('model');
        else if (!Model.db)
            return Err.missingDb();
        else
            return Err.checkParams(params);
    }

    static checkParams(params = {}) {
        const keys = Object.keys(params);
        for (const key of keys) {
            if (!params[key])
                return Err.missingParam(key);
        }
    }

    static make(scope, error, response) {
        if (response.statusCode >= 200 && response.statusCode < 400 && !response.body.error) {
            // no problem
            return;
        }
        else
            error = error || response.body;

        if (response.statusCode === 412) {
            // database create requested when database exists
            return new Err(scope, 'db_already_exists', 'Database already exists.', error);
        }
        else if ((response.statusCode === 404 && scope === 'db') || response.body.error === 'no_db_file' || response.body.reason === 'no_db_file') {
            // database destroy requested when database does not exist
            // database missing error
            return new Err(scope, 'no_db_file', 'Database missing.', error);
        }
        else if (response.statusCode === 404) {
            // something missing
            return this.missing(scope, error);
        }
        else if (response.statusCode === 409) {
            // revision mismatch
            return this.conflict(scope, error);
        }
        else if (response.body.error === 'doc_validation') {
            // something weird like insert of an _updated attribute
            return new Err(scope, 'doc_validation', 'Bad document member.', error);
        }
        else if (response.statusCode === 500 && scope === 'design' && response.body.error === 'TypeError') {
            // COUCHDB: that is one heck of an error
            // seems to only occur when a show is missing views do not
            // return the same
            return this.missing(scope, error);
        }
        else if (response.code === 'ECONNREFUSED') {
            // could not connect to the database
            return new Err(scope, 'connection_refused', 'Could not connect to database.', error);
        }
        else if (response.statusCode === 500 && scope === 'couch') {
            // design broken somehow
            return new Err(scope, 'malformed_script', 'Problem with one of your designs.', error);
        }

        // best guess!
        return new Err(scope, response.body.error, response.body.reason, error);
    }

    // common ones
    static missing(scope, err) {
        return new Err(scope, 'not_found', 'Not found.', err);
    }
    static missingParam(name) {
        const cName = name[0].toUpperCase() + name.slice(1);
        return new Err('ops', 'missing_param', cName + ' parameter required.');
    }
    static conflict(scope, err) {
        return new Err(scope, 'conflict', 'There was a conflict.', err);
    }
    static verifyFailed() {
        return new Err('ops', 'verify_failed', 'Verify code mismatch.');
    }
    static missingDb() {
        return new Err('model', 'missing_db', 'Model has not been decorated with a db.');
    }
    static missingRev() {
        return new Err('doc', 'missing_rev', 'No rev returned in header response.');
    }
}

module.exports = Err;
