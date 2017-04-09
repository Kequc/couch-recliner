'use strict';
const DocMeta = require('../../lib/meta/doc-meta');

const BODY = require('./body-helpers');
const DATA = require('./data-helpers');
const ERR = require('./err-helpers');

const DOC = {};

DOC.DESTROY = (done) => {
    DocMeta.destroy(DATA.Model, DATA.id, (err) => {
        ERR.EXPECT_NONE(err);
        done();
    });
};

DOC.CREATE = (callback) => {
    DocMeta.write(DATA.Model, DATA.id, DATA.doc, (err, doc) => {
        ERR.EXPECT_NONE(err);
        callback(doc);
    });
};

DOC.CREATE_WITH_ATTACHMENT = (callback) => {
    const _attachments = { [DATA.attname]: DATA.file };
    const body = Object.assign({}, DATA.doc, { _attachments });
    DocMeta.write(DATA.Model, DATA.id, body, (err, doc) => {
        ERR.EXPECT_NONE(err);
        callback(doc);
    });
};

DOC.EXPECT_DOES_NOT_EXIST = (id, done) => {
    DocMeta.head(DATA.Model, id, (err) => {
        ERR.EXPECT(err, 'not_found');
        done();
    });
};

DOC.EXPECT_EXISTS = (id, body, done) => {
    DocMeta.read(DATA.Model, id, (err, doc) => {
        ERR.EXPECT_NONE(err);
        BODY.EXPECT(doc, body);
        done();
    });
};

DOC.CHANGE_IN_BACKGROUND = (doc, callback) => {
    DocMeta.update(DATA.Model, doc.id, DATA.update, (err, doc2) => {
        ERR.EXPECT_NONE(err);
        BODY.EXPECT_ID(doc2, doc.id);
        BODY.EXPECT_NOT_REV(doc2, doc.rev);
        BODY.EXPECT_LATEST_REV(doc2, doc2.rev);
        BODY.EXPECT(doc2, Object.assign({}, doc.body, DATA.update));
        callback(doc2);
    });
};

module.exports = DOC;
