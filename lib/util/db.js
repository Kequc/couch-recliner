'use strict';

const Err = require('../err');

class Db {
    constructor (dbName, nano) {
        this.dbName = dbName;
        this.nano = nano;
        this.scoped = nano.use(dbName);
    }

    readAttachment(id, name, callback) {
        return this.scoped.attachment.get(id, name, {}, Err.resultFunc('attachment', callback));
    }

    writeAttachment(id, rev, name, data, mimeType, callback) {
        return this.scoped.attachment.insert(id, name, data, mimeType, { rev: rev }, Err.resultFunc('attachment', callback));
    }

    destroyAttachment(id, rev, name, callback) {
        this.scoped.attachment.destroy(id, name, { rev: rev }, Err.resultFunc('attachment', callback));
    }

    read(id, callback) {
        this.scoped.get(id, Err.resultFunc('doc', callback));
    }

    write(id, rev, body, callback) {
        body['_rev'] = rev;
        this.scoped.insert(body, id, Err.resultFunc('doc', callback));
    }

    destroy(id, rev, callback) {
        this.scoped.destroy(id, rev, Err.resultFunc('doc', callback));
    }

    head(id, callback) {
        // here we need the third parameter
        // not the second
        // the second seems empty...
        this.scoped.head(id, (raw, body, result) => {
            const err = Err.make('doc', raw);
            if (err)
                callback(err);
            else if (result['etag']) {
                // we have a new rev
                // nano puts it in the format '"etag"" so we need to
                // strip erroneous quotes
                callback(undefined, result['etag'].replace(/"/g, ''), result);
            }
            else
                callback(new Err('doc', 'missing_rev', 'Rev missing from header response.'));
        });
    }

    show(id, design, name, callback) {
        this.scoped.show(design, name, id, Err.resultFunc('show', callback));
    }

    view(id, design, name, params, callback) {
        this.scoped.view(design, name, params, Err.resultFunc('view', callback));
    }

    createDatabase(callback) {
        this.nano.db.create(this.dbName, Err.resultFunc('db', callback));
    }

    destroyDatabase(callback) {
        this.nano.db.destroy(this.dbName, Err.resultFunc('db', callback));
    }
}

module.exports = Db;
