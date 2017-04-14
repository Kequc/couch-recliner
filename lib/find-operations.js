'use strict';
const FindMeta = require('./meta/find-meta');
const Err = require('./models/err');
const Finder = require('./models/finder');

const FindOperations = {};

FindOperations.findOne = (Model, finder, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { finder });
    if (!(finder instanceof Finder)) finder = new Finder(finder);
    if (err)
        callback(err);
    else if (!finder.isValid())
        callback(Err.invalidParam('finder'));
    else
        FindMeta.findOne(Model, finder, callback);
};

FindOperations.find = (Model, finder, callback = ()=>{}) => {
    const err = Err.checkOps(Model, { finder });
    if (!(finder instanceof Finder)) finder = new Finder(finder);
    if (err)
        callback(err);
    else if (!finder.isValid())
        callback(Err.invalidParam('finder'));
    else
        FindMeta.find(Model, finder, callback);
};

module.exports = FindOperations;
