'use strict';

var _ = require('underscore');

var Mqtt = require('mqtt');

var TOPIC_NOTIFICATION = 'ruff-cloud-plus/notification';
var TOPIC_NOTIFICATION_INTER = 'ruff-cloud-plus/notification-inter';
var TOPIC_ACTION  = 'ruff-cloud-plus/action';

var HOST = '127.0.0.1';
var PORT = '1884';
var CLIENT_ID = 'background-client-1';

// mqtt client setting
var SETTINGS = {
  keepalive: 1000,
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clientId: CLIENT_ID,
  username: 'background',
  password: 'secret'
};



var  client = Mqtt.connect('mqtt://'+HOST+':'+PORT, SETTINGS);

client.on('error', function(err){
  console.log(err.message);

});


client.on('close', function(){
  console.log('\nClosed');
});

client.on('connect', function(){
  console.log('');
  console.log('Connected');

  client.subscribe(TOPIC_NOTIFICATION_INTER);

  client.on('message',function(topic, msg){
    switch(topic){
    case TOPIC_NOTIFICATION_INTER:
      console.log(msg.toString());
      var temp = JSON.parse(msg);
      var date = new Date();
      temp.time = date.getTime();

      client.publish(TOPIC_NOTIFICATION, JSON.stringify(temp));
      break;
      
    // case TOPIC_BACKGROUND_CLIENT_HEARTBEAT:
      
    //   console.log('');
    //   console.log(new Date());
    //   console.log(topic + ':');
    //   console.log(msg.toString());
      
    //   var obj = JSON.parse(msg.toString());
      
    //   var msg1 = JSON.stringify(
    //     {
    // 	  msg_id: obj.msg_id,
    // 	  sn: 0,
    // 	  gw: obj.gw,
    // 	  msg_type: 'h',
    // 	  value: 1
    // 	});
      
    //   client.publish('smartgarden/' + obj.gw + '/message',
    // 		     msg1);
      
    //   break;
      
    default:
      break;
    }
  });
});
