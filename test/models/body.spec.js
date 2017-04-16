'use strict';
const expect = require('chai').expect;

const Attachment = require('../../lib/models/attachment');
const Body = require('../../lib/models/body');
const DATA = require('../helpers/data-helpers');

describe('Models Body', function() {
    describe('constructor', function() {
        it('instantiates with data and attachments', function() {
            const data = { hi: 'there' };
            const attachments = {
                [DATA.attname]: new Attachment(DATA.file)
            };
            const result = new Body(data, attachments);
            expect(result.data).to.equal(data);
            expect(result.attachments).to.equal(attachments);
        });
        it('instantiates without attachments', function() {
            const data = { hi: 'there' };
            const result = new Body(data);
            expect(result.data).to.equal(data);
            expect(result.attachments).to.be.undefined;
        });
    });
    describe('build', function() {
        it('returns a new body with attachments', function() {
            const data = Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.file2
                }
            });
            const result = Body.create(data);
            expect(result).to.be.instanceof(Body);
            expect(result.data).to.eql(DATA.doc);
            expect(result.attachments).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(result.attachments[DATA.attname]).to.be.instanceof(Attachment);
            expect(result.attachments[DATA.attname].body).to.equal(DATA.file.body);
            expect(result.attachments[DATA.attname2]).to.be.instanceof(Attachment);
            expect(result.attachments[DATA.attname2].body).to.equal(DATA.file2.body);
        });
        it('returns a new body without _rev or _id', function() {
            const data = Object.assign({}, DATA.doc, {
                _id: DATA.id,
                _rev: DATA.rev
            });
            const result = Body.create(data);
            expect(result).to.be.instanceof(Body);
            expect(result.data).to.eql(DATA.doc);
        });
        it('returns a new body without attachments', function() {
            const result = Body.create(DATA.doc);
            expect(result).to.be.instanceof(Body);
            expect(result.data).to.eql(DATA.doc);
            expect(result.attachments).to.eql({});
        });
        it('returns a new body with attachments set undefined', function() {
            const data = Object.assign({}, DATA.doc, {
                _attachments: undefined
            });
            const result = Body.create(data);
            expect(result).to.be.instanceof(Body);
            expect(result.data).to.eql(DATA.doc);
            expect(result.attachments).to.be.undefined;
        });
    });
    describe('extend', function() {
        it('extends the existing body', function() {
            const body = Body.create(DATA.doc);
            for (const data of [DATA.update, DATA.update2]) {
                const result = body.extend(data);
                expect(result).to.be.instanceof(Body);
                expect(result).to.not.equal(body);
                expect(result.data).to.eql(Object.assign({}, DATA.doc, data));
                expect(result.attachments).to.eql({});
            }
        });
        it('extends the provided body introducing attachments', function() {
            const body = Body.create(Object.assign({}, DATA.update, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.file2
                }
            }));
            const result = body.extend(Object.assign({}, DATA.doc, {
                _attachments: undefined
            }));
            expect(body.attachments).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(result).to.be.instanceof(Body);
            expect(result).to.not.equal(body);
            expect(result.data).to.eql(Object.assign({}, DATA.doc, DATA.update));
            expect(result.attachments).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(result.attachments[DATA.attname]).to.be.instanceof(Attachment);
            expect(result.attachments[DATA.attname].body).to.equal(DATA.file.body);
            expect(result.attachments[DATA.attname2]).to.be.instanceof(Attachment);
            expect(result.attachments[DATA.attname2].body).to.equal(DATA.file2.body);
        });
        it('extends the provided body adding attachments', function() {
            const body = Body.create(Object.assign({}, DATA.update, {
                _attachments: {
                    [DATA.attname2]: DATA.file2
                }
            }));
            const result = body.extend(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file
                }
            }));
            expect(body.attachments).to.have.all.keys(DATA.attname2);
            expect(result).to.be.instanceof(Body);
            expect(result).to.not.equal(body);
            expect(result.data).to.eql(Object.assign({}, DATA.doc, DATA.update));
            expect(result.attachments).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(result.attachments[DATA.attname]).to.be.instanceof(Attachment);
            expect(result.attachments[DATA.attname].body).to.equal(DATA.file.body);
            expect(result.attachments[DATA.attname2]).to.be.instanceof(Attachment);
            expect(result.attachments[DATA.attname2].body).to.equal(DATA.file2.body);
        });
        it('extends the provided body replacing attachments', function() {
            const body = Body.create(Object.assign({}, DATA.update, {
                _attachments: {
                    [DATA.attname2]: DATA.fileText
                }
            }));
            const result = body.extend(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.file2
                }
            }));
            expect(body.attachments).to.have.all.keys(DATA.attname2);
            expect(result).to.be.instanceof(Body);
            expect(result).to.not.equal(body);
            expect(result.data).to.eql(Object.assign({}, DATA.doc, DATA.update));
            expect(result.attachments).to.have.all.keys(DATA.attname, DATA.attname2);
            expect(result.attachments[DATA.attname]).to.be.instanceof(Attachment);
            expect(result.attachments[DATA.attname].body).to.equal(DATA.file.body);
            expect(result.attachments[DATA.attname2]).to.be.instanceof(Attachment);
            expect(result.attachments[DATA.attname2].body).to.equal(DATA.fileText.body);
        });
        it('extends the provided body erasing attachments', function() {
            const body = Body.create(Object.assign({}, DATA.update, {
                _attachments: undefined
            }));
            const result = body.extend(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.file2
                }
            }));
            expect(body.attachments).to.be.undefined;
            expect(result).to.be.instanceof(Body);
            expect(result).to.not.equal(body);
            expect(result.data).to.eql(Object.assign({}, DATA.doc, DATA.update));
            expect(result.attachments).to.be.undefined;
        });
    });
    describe('isValid', function() {
        it('returns true on valid data', function() {
            const body = Body.create(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.file2,
                    [DATA.attname3]: undefined
                }
            }));
            expect(body.isValid()).to.be.true;
            expect(Body.create({}).isValid()).to.be.true;
        });
        it('returns true on valid data with attachments set undefined', function() {
            const body = Body.create(Object.assign({}, DATA.doc, {
                _attachments: undefined
            }));
            expect(body.isValid()).to.be.true;
        });
        it('returns false if data not an object', function() {
            expect(Body.create(undefined).isValid()).to.be.false;
            expect(Body.create(11).isValid()).to.be.false;
            expect(Body.create(function() {}).isValid()).to.be.false;
        });
        it('returns false if any attachments are not valid', function() {
            const body = Body.create({
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
            const result = Body.create(DATA.doc).forDoc();
            expect(result).to.eql(Object.assign({}, DATA.doc, {
                _attachments: {}
            }));
        });
        it('returns data formatted with no _attachments', function() {
            const body = Body.create(Object.assign({}, DATA.doc, {
                _attachments: undefined
            }));
            const result = body.forDoc();
            expect(body.attachments).to.be.undefined;
            expect(result).to.eql(Object.assign({}, DATA.doc, {
                _attachments: {}
            }));
        });
        it('returns attachments formatted for doc', function() {
            const body = Body.create(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.file2,
                    [DATA.attname3]: DATA.fileStub
                }
            }));
            const result = body.forDoc();
            expect(result).to.eql(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: body.attachments[DATA.attname].toStub(),
                    [DATA.attname2]: body.attachments[DATA.attname2].toStub(),
                    [DATA.attname3]: body.attachments[DATA.attname3].toStub()
                }
            }));
        });
    });
    describe('forHttp', function() {
        it('returns data formatted for http', function() {
            const result = Body.create(DATA.doc).forHttp(DATA.rev);
            expect(result).to.eql({
                body: Object.assign({}, DATA.doc, {
                    _attachments: {},
                    _rev: DATA.rev
                })
            });
        });
        it('returns data formatted with no _rev', function() {
            const result = Body.create(DATA.doc).forHttp(undefined);
            expect(result).to.eql({
                body: Object.assign({}, DATA.doc, {
                    _attachments: {},
                    _rev: undefined
                })
            });
        });
        it('returns data formatted with no _attachments', function() {
            const body = Body.create(Object.assign({}, DATA.doc, {
                _attachments: undefined
            }));
            const result = body.forHttp(DATA.rev);
            expect(body.attachments).to.be.undefined;
            expect(result).to.eql({
                body: Object.assign({}, DATA.doc, {
                    _attachments: {},
                    _rev: DATA.rev
                })
            });
        });
        it('returns attachments formatted for http', function() {
            const body = Body.create(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.fileStub
                }
            }));
            const result = body.forHttp(DATA.rev);
            expect(result).to.eql({
                body: Object.assign({}, DATA.doc, {
                    _attachments: {
                        [DATA.attname]: body.attachments[DATA.attname].forHttp()
                    },
                    _rev: DATA.rev
                })
            });
        });
        it('returns attachments formatted as multipart', function() {
            const body = Body.create(Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: DATA.file,
                    [DATA.attname2]: DATA.fileText,
                    [DATA.attname3]: DATA.fileStub
                }
            }));
            const result = body.forHttp(DATA.rev);
            const expected = Object.assign({}, DATA.doc, {
                _attachments: {
                    [DATA.attname]: body.attachments[DATA.attname].forHttp(),
                    [DATA.attname2]: body.attachments[DATA.attname2].forHttp(),
                    [DATA.attname3]: body.attachments[DATA.attname3].forHttp()
                },
                _rev: DATA.rev
            });
            expect(result).to.eql({
                multipart: [
                    {
                        'content-type': 'application/json',
                        body: JSON.stringify(expected)
                    },
                    {
                        'content-type': body.attachments[DATA.attname].type,
                        body: body.attachments[DATA.attname].body
                    },
                    {
                        'content-type': body.attachments[DATA.attname2].type,
                        body: body.attachments[DATA.attname2].body
                    }
                ]
            });
        });
    });
});
