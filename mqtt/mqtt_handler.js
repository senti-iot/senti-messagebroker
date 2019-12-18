const mqtt = require('mqtt');
const log = require('../logger/index').log
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
			log({
				msg: 'MQTT Client failed to connect',
				type: 'fatal'
			})
			this.mqttClient.end();
		});

		// Connection callback
		this.mqttClient.on('connect', () => {
			log({
				msg: 'MQTT Client connected',
				type: 'info'
			})
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