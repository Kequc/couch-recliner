'use strict';
const request = require('request');

const Http = {};

Http.rawRequest = (options, callback) => {
    request(options, callback);
};

Http.request = (options, callback) => {
    Http.rawRequest(Object.assign({ json: true }, options), callback);
};

module.exports = Http;
