'use strict';
const request = require('request');

const BodyParser = require('./body-parser');

const Http = {};

Http.rawRequest = (options, callback) => {
    request(Object.assign({ json: true }, options), callback);
};

Http.multipartRequest = (options, data, callback) => {
    const parsed = BodyParser.forHttp(data);
    Http.rawRequest(Object.assign({}, options, parsed), callback);
};

module.exports = Http;
