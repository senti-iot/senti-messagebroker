const mqtt = require('mqtt');

class MqttHandler {
  constructor(topic) {
    this.mqttClient = null;
    this.host = 'mqtt://hive.senti.cloud';
    this.username = 'YOUR_USER'; // mqtt credentials if these are needed to connect
	this.password = 'YOUR_PASSWORD';
	this.topic = topic
  }
  init() {}
  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, { username: this.username, password: this.password });

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log(`mqtt ${this.topic} client connected`);
    });

    // mqtt subscriptions
	this.mqttClient.subscribe(this.topic, {qos: 0});
	// console.log(this.topic)

    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
      console.log('received',message);
    });

    this.mqttClient.on('close', () => {
      console.log(`mqtt client disconnected`);
	});
	this.init()
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(topic,message) {
	this.mqttClient.publish(topic, message);
	console.log(this.topic, message)
  }
}

module.exports = MqttHandler;