#!/usr/bin/env nodejs
const dotenv = require('dotenv').load()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
// const pino = require('pino')
// const fs = require('fs')
const logger = require('./logger/index').log
const bodyParser = require('body-parser')
// module.exports.log=pino(pino.destination(`/var/log/nodejs/messagebroker/${new Date().toLocaleDateString().replace(/\//g, '-')}-others.json`))
// const logger=pino(pino.destination(`/var/log/nodejs/databroker/${new Date().toLocaleDateString().replace(/\//g, '-')}.json`))
module.exports.log = logger
// const mqttHandler = require('./mqtt/receiveData')
// const expressPino = require('express-pino-logger')({
// 	logger: logger
// })
// app.use(expressPino)

//#region MQTT FOR API
const SecureMqttHandler = require('./mqtt/SecureMqttHandler')
const secureMqttClient = new SecureMqttHandler(process.env.MQTT_HOST, process.env.MQTT_USER, process.env.MQTT_PASS)
secureMqttClient.connect()
module.exports.secureMqttClient = secureMqttClient
//#endregion

const httpBridge = require('./api/httpBridge')

const port = process.env.NODE_PORT || 3003

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

// app.use('/', indexRouter)
// app.use('/weather', weatherRouter)
// app.use('/holidays', holidaysRouter)
// app.use('/annual', annualRouter)
// app.use('/apiversion', apiVersionRouter)
// app.use('/template', templateRouter)
app.use('/', httpBridge)
//---Start the express server---------------------------------------------------


const startAPIServer = () => {
	app.listen(port, () => {
		console.log('Senti Message Broker started on port:', port)
		logger(`Senti Message Broker listening on port ${port}`, 'info')
	}).on('error', (err) => {
		if (err.errno === 'EADDRINUSE') {
			console.log('Server not started, port ' + port + ' is busy')
		} else {
			console.log(err)
		}
	})
}

startAPIServer()
