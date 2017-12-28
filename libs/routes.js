"use strict"
var restify = require('restify');
var settings = {name: 'Locbit RESTful API\n\t-----'}


function init(config, procotol) {
    var api = restify.createServer(settings);
    api.use(restify.bodyParser({ mapParams: true }));
    api.use(restify.gzipResponse());
    api.pre(restify.pre.sanitizePath());// no trailing slash in routes
    api.pre(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        req.headers.accept = 'application/json';  // only JSON requests
        return next();
    });

    var server = api.listen(config.port, function() {
        console.log('%s listening at %s', api.name, api.url);
    });


    api.post('/event', function (req, res, next) {
        procotol.send(req.params, {req:req});
        res.send(200, {success: true});
        next();
    });
}


module.exports = {
    init: init
};