'use strict';
const request = require('request');

const BodyParser = require('./body-parser');

const Http = {};

Http.rawRequest = (options, callback) => {
    request(options, callback);
};

Http.request = (options, callback) => {
    Http.rawRequest(Object.assign({ json: true }, options), callback);
};

Http.multipart = (options, data, callback) => {
    const parsed = BodyParser.forHttp(data);
    Http.request(Object.assign({}, options, parsed), callback);
};

module.exports = Http;
