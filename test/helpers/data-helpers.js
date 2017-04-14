'use strict';
const fs = require('fs');
const path = require('path');

const Model = require('../../lib/model');
const DocMutator = require('../../lib/util/doc-mutator');

const DATA = {
    dbName: 'couch-recliner',
    id: 'fake-id',
    rev: '1-fake-rev',
    rev2: '2-fake-rev',
    rev3: '3-fake-rev',
    attname: 'fake-attachment.txt',
    attname2: 'fake-attachment-2.txt',
    attname3: 'fake-attachment-3.txt',
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
        body: 'Hi I\'m some data'
    },
    fileStub: {
        stub: true,
        content_type: 'text/html',
        length: 20
    },
    doc: require('./data/doc.json'),
    doc2: require('./data/doc2.json'),
    find: {
        selector: { hello: { '$gt': 100 } },
        fields: ['test', 'hello', 'deep', 'array', 'bool']
    },
    find2: {
        selector: { hello: { '$gt': 1 } },
        fields: ['test', 'hello', 'deep', 'array', 'bool']
    }
};

DATA.Model = class extends Model {};
DATA.Model.dbName = DATA.dbName;

DATA.GENERATE_FAKE_DOC = () => DocMutator.build(DATA.Model, DATA.doc, DATA.id, DATA.rev, DATA.rev);

module.exports = DATA;
