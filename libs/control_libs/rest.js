var Q = require("q");
var http = require('http');
var https = require('https');

function process(instructions) {
    var deferred = Q.defer();

    var request;

    try {
        if(instructions.port == "443") {
            request = https.request(instructions, function(response) {
                handleRequest(response, deferred);
            }).on("error", function(err) {
                deferred.reject(err);
            });
        } else {
            request = http.request(instructions, function(response) {
                handleRequest(response, deferred);
            }).on("error", function(err) {
                deferred.reject(err);
            });
        }

        if(instructions.postBody) {
            request.write(instructions.postBody);
        }
    } catch(e) {
        deferred.reject(e);
    }

    request.end();

    return deferred.promise;
}

function handleRequest(response, deferred) {
    var body = '';
    response.on('data', function(chunk) {
        body += chunk;
    });

    response.on('end', function() {
        deferred.resolve(body);
    });

    response.on('error', function(err) {
        deferred.reject(err);
    });
}

var rest = {};

rest.process = process;

module.exports = rest;