var ws = require('ws');
var websocket = null;
var timer = null;
var local_config = null;

function connect(config) {
    try {
        local_config = config;
        console.log('Connecting to Locbit websocket...')
        console.log('config', config);
        websocket = new ws(config.endpoint);
        websocket.on("open", function () {
            console.log('Websocket has been connected. Ready to use now.');
            clearTimer();

            websocket.on("message", function (message) {
                message = JSON.parse(message);
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

function send(data, config) {
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
