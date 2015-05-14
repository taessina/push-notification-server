var app = require('express')();
var http = require('http').Server(app);
app.get('/', function (req, res) {
    'use strict';
    res.send('<h1>Hello world from Intel Galileo</h1>');
});
http.listen(1337, function () {
    'use strict';
    console.log('>> listening on *:1337');
});

//Preparing GCM

var gcm = require('node-gcm'),
    gcm_message = new gcm.Message(),
    sender = new gcm.Sender("AIzaSyBMAm9g1my2hw61_cnv9Lv12I2W3q1B5Ew"),
    RETRY_COUNT = 4;

gcm_message.addDataWithKeyValue('message', "FKEKK Push Message");
gcm_message.addDataWithKeyValue('msgcnt', "3BENC");
gcm_message.delayWhileIdle = true;

//temperory variable to store the received smartphone gcm_id
var r_gcm_id = "";

function send_gcm(){
        sender.send(gcm_message, r_gcm_id, RETRY_COUNT, function(err, result){
                console.log(">> Message returned by the GCM: ");
                console.log(result);
                console.log(err);
        });
};


//Create Socket.io object with http server
var io = require('socket.io')(http);
//Attach a 'connection' event handler to the server
io.on('connection', function (socket) {
    'use strict';
    console.log('>> a user connected');
    //Emits an event along with a message
    socket.emit('connected', 'Welcome');

    socket.on('token', function(msg){
        console.log(">> received gcm_id: " + msg);
        r_gcm_id = msg;
        console.log(">> Galileo requesting GCM to push a created notification to smartphone with ID :" + r_gcm_id);
        setTimeout(function(){ }, 5000);
        send_gcm();
    });

    //Attach a 'disconnect' event handler to the socket
    socket.on('disconnect', function () {
        console.log('>> user disconnected');
    });
});



