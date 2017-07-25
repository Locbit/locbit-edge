"use strict"
var url = require('url');
var fs = require('fs');

var current_lib = null;

var config;
config = require('./config/config.js');
var localConfig = require("./config.js");
for(var prop in localConfig) {
    config[prop] = localConfig[prop];
}

var protocol = require('./libs/control_libs/'+config.default.protocol +'.js');

current_lib = protocol.connect(config);

// Init
var route = require('./libs/routes.js');
route.init(config, protocol);


process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    console.log('Disconnect '+protocol.name+'....');
    if (current_lib != null && typeof protocol.disconnect == 'function') {
        protocol.disconnect();
    }
    protocol.reconnect();
});
