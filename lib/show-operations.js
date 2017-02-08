'use strict';
const DocOperations = require('./doc-operations');
const Err = require('./err');

const ShowOperations = {};

// TODO: we need a way to force persist individual shows in
// cases where they have been changed
ShowOperations.catalog = (Model, id, design, name, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { id, design, name });
    if (err)
        callback(err);
    else
        _catalog(Model, id, design, name, callback);
}

function _catalog(Model, id, design, name, callback, tries = 0) {
    tries++;
    _performCatalog(Model, id, design, name, (err, result) => {
        if (err && tries <= 1 && (err.name === 'no_db_file' || err.name === 'not_found')) {
            _updateDesign(Model, design, [name], (err) => {
                if (err)
                    callback(err);
                else
                    _catalog(Model, id, design, name, callback, tries);
            });
        }
        else if (err)
            callback(err);
        else
            callback(undefined, result); // executed successfully
    });
}

function _performCatalog(Model, id, design, name, callback) {
    Model.db.show(design, name, id, Err.resultFunc('design', callback));
}

function _updateDesign(Model, designId, names, callback) {
    const design = this.db.designs[designId];
    if (!design) {
        callback(new Err('show', 'not_defined', 'No design specified for: ' + designId));
        return;
    }
    // generate design document
    const body = {
        language: design.language,
        shows: {}
    };
    for (const name of names) {
        if (design.shows[name])
            body.shows[name] = design.shows[name];
        else {
            callback(new Err('show', 'missing_show', 'Missing deinition for: ' + name));
            return;
        }
    }
    // update design
    DocOperations.updateOrWrite(Model, '_design/' + designId, body, callback);
}

module.exports = ShowOperations;
