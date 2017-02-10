'use strict';

const DbMeta = {};

DbMeta.reset = (Model, callback) => {
    DbMeta.destroy((err) => {
        if (err && err.name !== 'no_db_file')
            callback(err);
        else
            DbMeta.create(callback);
    });
}

DbMeta.destroy = (Model, callback) => {
    Model.db.destroyDatabase(callback);
}

DbMeta.create = (Model, callback) => {
    Model.db.createDatabase(callback);
}

module.exports = DBMeta;
