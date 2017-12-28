var ws = require('ws');
var websocket = null;
var timer = null;
var local_config = null;

var lib = {
    'octoprint' : require('../octoprint.js')
}

//for store the protocol type that the connection support so that it will preprocess before sending it via procotol by CML
var connection = {};

function connect(config) {
    try {
        local_config = config;
        console.log('Connecting to Locbit websocket...')
        websocket = new ws(config.endpoint);
        websocket.on("open", function () {
            console.log('Websocket has been connected. Ready to use now.');
            clearTimer();

            websocket.on("message", function (message) {
                console.log('WE GOT MESSAAGE', message);
                message = JSON.parse(message);
                // message should come with protocol, identifier and payload
                if (message.hasOwnProperty('protocol') && message.hasOwnProperty('identifier') && message.hasOwnProperty('payload')) {
                    var protocol = require('./'+message.protocol +'.js');
                    var payload = message.payload;
                    if (connection.hasOwnProperty(message['identifier'])) {
                        payload = lib[connection[message['identifier']]['protocol']].preprocess(connection[message['identifier']]['payload'], payload);
                    }

                    protocol.process(payload).then(function(result){
                        //TODO may need handler after it is done
                        console.log('reply back', result);
                    });
                }
                // TODO need to send to the event emitter
            });
        });

        websocket.on('close', function close() {
            console.log('got disconnect.. trying to reconnect');
            reconnect();
        });

        return websocket;
    } catch(e) {
        console.log('catch error');
        console.log(e);
        return null;
    }
}

/**
 * send
 *
 * data: payload for sending via websocket
 * config: JSON - req, it contain information from request
 * @param data
 * @param config
 */
function send(data, config) {
    var req = config.req;
    if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('protocol')
        && req.headers.hasOwnProperty('protocol-identifier') && req.headers.hasOwnProperty('protocol-payload')) {
        connection[req.headers['protocol-identifier']] = {
            protocol : req.headers['protocol'],
            payload: req.headers['protocol-payload']
        }
    }
    websocket.send(JSON.stringify(data));
}

function reconnect() {
    clearTimer();
    timer = setTimeout(function(){
        console.log('reconnecting');
        connect(local_config);
    }, 3000);
}

function disconnect() {
    websocket.close();
}

function clearTimer() {
    if (timer != null) {
        clearTimeout(timer);
    }
}

module.exports = {
    name: 'Websocket',
    send: send,
    connect : connect,
    reconnect : reconnect
};
