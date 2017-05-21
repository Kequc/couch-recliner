'use strict';
const { expect } = require('chai');

const Attachment = require('../../lib/models/attachment');
const Body = require('../../lib/models/body');
const BODY = require('../helpers/body-helpers');
const DATA = require('../helpers/data-helpers');

describe('Models Body', function() {
    describe('constructor', function() {
        it('returns a new body with attachments', function() {
            const data = Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.file2
                }
            });
            const body = new Body(data);
            expect(body.data).to.eql(data);
            expect(body.data._attachments).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(body.data._attachments[DATA.attname].body).to.equal(DATA.file.body);
            expect(body.data._attachments[DATA.attname2].body).to.equal(DATA.file2.body);
        });
        it('returns a new body without attachments', function() {
            const body = new Body(DATA.doc);
            expect(body.data).to.eql(DATA.doc);
            expect(body.data._attachments).to.be.undefined;
        });
        it('returns a new body with attachments set undefined', function() {
            const data = Object.assign({}, DATA.doc, {
                _attachments: undefined
            });
            const body = new Body(data);
            expect(body.data).to.eql(data);
            expect(body.data._attachments).to.be.undefined;
        });
    });
    describe('parsed', function() {
        it('merges separate data sets', function() {
            for (const data of [DATA.update, DATA.update2]) {
                const body = new Body(data);
                body.extends = DATA.doc;
                expect(body.data).to.eql(data);
                expect(body.data._attachments).to.be.undefined;
                expect(body.extends).to.eql(DATA.doc);
                expect(body.extends._attachments).to.be.undefined;
                const result = body.parsed();
                expect(result).to.not.eql(body.data);
                expect(result).to.not.eql(body.extends);
                const expected = BODY.DEEP_EXTEND(DATA.doc, data);
                expect(result).to.eql(expected);
            }
        });
        it('removes _id and _rev', function() {
            const body = new Body(Object.assign({}, DATA.doc, {
                _id: DATA.id,
                _rev: DATA.rev
            }));
            const result = body.parsed();
            expect(result).to.eql(DATA.doc);
            expect(result._id).to.be.undefined;
            expect(result._rev).to.be.undefined;
        });
        it('extends the provided body introducing attachments', function() {
            const body = new Body(Object.assign({}, DATA.update, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.file2
                }
            }));
            body.extends = DATA.doc;
            expect(body.data._attachments).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(body.extends._attachments).to.be.undefined;
            const result = body.parsed();
            expect(result._attachments).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(result._attachments[DATA.attname].body).to.equal(DATA.file.body);
            expect(result._attachments[DATA.attname2].body).to.equal(DATA.file2.body);
        });
        it('extends the provided body adding attachments', function() {
            const body = new Body(Object.assign({}, DATA.update, {
                _attachments: {
                    [DATA.attname2]: DATA.file2
                }
            }));
            body.extends = Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file
                }
            });
            expect(body.data._attachments).to.have.all.keys(DATA.attname2);
            expect(body.extends._attachments).to.have.all.keys(DATA.attname);
            const result = body.parsed();
            expect(result._attachments).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(result._attachments[DATA.attname].body).to.equal(DATA.file.body);
            expect(result._attachments[DATA.attname2].body).to.equal(DATA.file2.body);
        });
        it('extends the provided body replacing attachments', function() {
            const body = new Body(Object.assign({}, DATA.update, {
                _attachments: {
                    [DATA.attname2]: DATA.fileText
                }
            }));
            body.extends = Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.file2
                }
            });
            expect(body.data._attachments).to.have.all.keys(DATA.attname2);
            expect(body.extends._attachments).to.have.all.keys(DATA.attname, DATA.attname2);
            const result = body.parsed();
            expect(result._attachments).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(result._attachments[DATA.attname].body).to.equal(DATA.file.body);
            expect(result._attachments[DATA.attname2].body).to.equal(DATA.fileText.body);
        });
        it('extends the provided body erasing attachments', function() {
            const body = new Body(Object.assign({}, DATA.update, {
                _attachments: undefined
            }));
            body.extends = Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.file2
                }
            });
            expect(body.data._attachments).to.be.undefined;
            expect(body.extends._attachments).to.have.all.keys(DATA.attname, DATA.attname2);
            const result = body.parsed();
            expect(result._attachments).to.be.undefined;
        });
    });
    describe('isValid', function() {
        it('returns true on valid data', function() {
            const body = new Body(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.file2,
                    [DATA.attname3]: undefined
                }
            }));
            expect(body.isValid()).to.be.true;
            expect(new Body({}).isValid()).to.be.true;
        });
        it('returns true on valid data with attachments set undefined', function() {
            const body = new Body(Object.assign({}, DATA.doc, {
                _attachments: undefined
            }));
            expect(body.isValid()).to.be.true;
        });
        it('returns false if data not an object', function() {
            expect(new Body(undefined).isValid()).to.be.false;
            expect(new Body(11).isValid()).to.be.false;
            expect(new Body(function() {}).isValid()).to.be.false;
        });
        it('returns false if any attachments are not valid', function() {
            const body = new Body({
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: 11
                }
            });
            expect(body.isValid()).to.be.false;
        });
    });
    describe('forDoc', function() {
        it('returns data formatted for doc', function() {
            const body = new Body(DATA.doc)
            const result = body.forDoc();
            expect(result).to.eql(DATA.doc);
        });
        it('returns data formatted with no _attachments', function() {
            const body = new Body(Object.assign({}, DATA.doc, {
                _attachments: undefined
            }));
            const result = body.forDoc();
            expect(result).to.eql(DATA.doc);
        });
        it('returns attachments formatted as stubs', function() {
            const body = new Body(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.file2,
                    [DATA.attname3]: DATA.fileStub
                }
            }));
            const result = body.forDoc();
            expect(result).to.eql(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: new Attachment(body.data._attachments[DATA.attname]).toStub(),
                    [DATA.attname2]: new Attachment(body.data._attachments[DATA.attname2]).toStub(),
                    [DATA.attname3]: new Attachment(body.data._attachments[DATA.attname3]).toStub()
                }
            }));
        });
    });
    describe('forHttp', function() {
        it('returns data formatted for http', function() {
            const result = new Body(DATA.doc).forHttp(DATA.rev);
            expect(result).to.eql({
                body: Object.assign({}, DATA.doc, {
                    _rev: DATA.rev
                })
            });
        });
        it('returns data formatted with no _rev', function() {
            const result = new Body(DATA.doc).forHttp(undefined);
            expect(result).to.eql({
                body: Object.assign({}, DATA.doc, {
                    _rev: undefined
                })
            });
        });
        it('returns data formatted with no _attachments', function() {
            const body = new Body(Object.assign({}, DATA.doc, {
                _attachments: undefined
            }));
            const result = body.forHttp(DATA.rev);
            expect(result).to.eql({
                body: Object.assign({}, DATA.doc, {
                    _rev: DATA.rev
                })
            });
        });
        it('returns attachments formatted for http', function() {
            const body = new Body(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.fileStub
                }
            }));
            const result = body.forHttp(DATA.rev);
            expect(result).to.eql({
                body: Object.assign({}, DATA.doc, {
                    _attachments: {
                        [DATA.attname]: new Attachment(body.data._attachments[DATA.attname]).forHttp()
                    },
                    _rev: DATA.rev
                })
            });
        });
        it('returns attachments formatted as multipart', function() {
            const body = new Body(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.fileText,
                    [DATA.attname3]: DATA.fileStub
                }
            }));
            const result = body.forHttp(DATA.rev);
            const expected = Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: new Attachment(body.data._attachments[DATA.attname]).forHttp(),
                    [DATA.attname2]: new Attachment(body.data._attachments[DATA.attname2]).forHttp(),
                    [DATA.attname3]: new Attachment(body.data._attachments[DATA.attname3]).forHttp()
                },
                _rev: DATA.rev
            });
            expect(result).to.eql({
                multipart: [
                    {
                        'content-type': 'application/json',
                        body: JSON.stringify(expected)
                    },
                    new Attachment(body.data._attachments[DATA.attname]).forMultipart(),
                    new Attachment(body.data._attachments[DATA.attname2]).forMultipart()
                ]
            });
        });
    });
});
