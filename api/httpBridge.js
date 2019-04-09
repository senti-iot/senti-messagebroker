const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
var mqttHandler = require('../mqtt/mqtt_handler')
var dataBrokerChannel = new mqttHandler('senti-data')
dataBrokerChannel.connect()

router.get('/:version/', async (req, res, next) => {
	let apiVersion = req.params.version

	let authToken = req.headers.auth
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			res.json('API/httpBridge GET Access Authenticated!')
		} else {
			res.status(403).json('Unauthorized Access! 403')
			console.log('Unauthorized Access!')
		}
	} else {
		console.log(`API/httpBridge version: ${apiVersion} not supported`)
		res.send(`API/httpBridge version: ${apiVersion} not supported`)
	}
})

router.post('/:version', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth
	let data = req.body
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {

			// res.json('API/httpBridge POST Access Authenticated!')
			console.log('API/httpBridge POST Access Authenticated!')

			//Send the data to DataBroker
			dataBrokerChannel.sendMessage(`${JSON.stringify(data)}`)
		} else {
			res.status(403).json('Unauthorized Access! 403')
			console.log('Unauthorized Access!')
		}
	} else {
		console.log(`API/httpBridge version: ${apiVersion} not supported`)
		res.send(`API/httpBridge version: ${apiVersion} not supported`)
	}
})

module.exports = router
