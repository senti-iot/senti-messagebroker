const mqtt = require('mqtt');

class MqttHandler {
	constructor() {
		this.mqttClient = null;
		this.host = 'mqtt://hive.senti.cloud';
	}
	init() { }
	connect() {
		this.init()
		this.mqttClient = mqtt.connect(this.host);

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
	sendMessage(topic, message) {
		this.mqttClient.publish(topic, message);
		console.log('SENDING MESSAGE')
		console.log(topic)
		console.log(message)
	}
}

module.exports = MqttHandler;