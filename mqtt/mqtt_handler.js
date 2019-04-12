const mqtt = require('mqtt');

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = 'mqtt://hive.senti.cloud';
    this.username = 'YOUR_USER'; // mqtt credentials if these are needed to connect
	this.password = 'YOUR_PASSWORD';
  }
  init() {}
  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
	this.init()
    this.mqttClient = mqtt.connect(this.host, { username: this.username, password: this.password });

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log(`mqtt client connected`);
    });


    this.mqttClient.on('close', () => {
      console.log(`mqtt client disconnected`);
	});
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(topic,message) {
	this.mqttClient.publish(topic, message);
	console.log(this.topic, message)
  }
}

module.exports = MqttHandler;