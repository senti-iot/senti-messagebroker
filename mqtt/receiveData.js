const mqttHandler = require('./mqtt_handler')
var dataBrokerChannel = new mqttHandler('senti-data')
dataBrokerChannel.connect()

class DataReceive extends mqttHandler {
	init() {
		this.mqttClient.on('message', (topic, message) => {
			console.log('test',message)
			this.sendData(message)
		})
	}
	sendData(message) {
		let data = JSON.parse(message)
		console.log(data)
		dataBrokerChannel.sendMessage(message)
	}
}

module.exports = DataReceive