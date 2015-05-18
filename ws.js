var gcm = require('node-gcm'),
  gcm_message = new gcm.Message(),
  sender = new gcm.Sender("AIzaSyBzGvwYN21Zh3Cd1Q44JZnG_R_-brzoBC4"),
  RETRY_COUNT = 4;

gcm_message.addDataWithKeyValue('message', "FKEKK");
gcm_message.addDataWithKeyValue('msgcnt', "1");
gcm_message.addDataWithKeyValue('title', "IoT");
gcm_message.delayWhileIdle = true;

var r_gcm = "";

function send_gcm() {
  sender.send(gcm_message, r_gcm, RETRY_COUNT, function(err, result){
    console.log(">>Message returned by the GCM");
    console.log("result: " + result);
    console.log("error: " + err);
  });
};


var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 1337});

  console.log("starting...");

  // var count = 0;
  // function f(){
  //   count = count + 1;
  //   ws.send('hi_' + count);
  //   setTimeout(f, 2000);
  // };

  wss.on('connection', function(ws){
    ws.on('message', function(message){
      console.log("received: %s", message);
      //ws.send('received: ' + message);
      var msg = JSON.parse(message);
      switch(msg.type){
        case "token":
          r_gcm = msg.text;
          setTimeout(function(){send_gcm(); }, 3000);
          break;
        case "nudge":
          console.log("Client " + msg.text + " with " + msg.anytag);
      }

      var msg = {
        type: "nudge",
        message: "lololol"
      }
      ws.send(JSON.stringify(msg));
      //send_gcm();
      //setTimeout(f, 2000);
    });
    console.log("user connected!");
    ws.send('something');
  });
