'use strict';
const fs = require('fs');
const path = require('path');

const ModelBase = require('../../lib/model');

const DATA = {
    dbName: 'couch-recliner',
    id: 'fake-id',
    rev: '1-fake-rev',
    attname: 'fake-attachment.txt',
    attname2: 'fake-attachment-2.txt',
    update: { race: 'cat' },
    update2: { dog: 'ball' },
    file: {
        content_type: 'text/html',
        body: fs.readFileSync(path.join(__dirname, './data/attachment.txt'))
    },
    file2: {
        content_type: 'text/html',
        body: fs.readFileSync(path.join(__dirname, './data/attachment2.txt'))
    },
    fileText: {
        content_type: 'text/html',
        body: "Hi I'm some data"
    },
    doc: require('./data/doc.json'),
    doc2: require('./data/doc2.json')
};

class Model extends ModelBase {}
Model.dbName = DATA.dbName;
DATA.Model = Model;

DATA.GENERATE_FAKE_DOC = () => {
    return new DATA.Model(DATA.doc, {
        id: DATA.id,
        rev: DATA.rev
    });
};

module.exports = DATA;
