"use strict";
const AttachmentOperations = require('./attachment-operations');
const DbOperations = require('./db-operations');
const DocOperations = require('./doc-operations');
const Err = require('./err');
const Model = require('./model');
const ShowOperations = require('./show-operations');
const ViewOperations = require('./view-operations');

module.exports = {
    AttachmentOperations,
    DbOperations,
    DocOperations,
    Err,
    Model,
    ShowOperations,
    ViewOperations
};
