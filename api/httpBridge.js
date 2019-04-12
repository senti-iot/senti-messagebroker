const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
var mqttHandler = require('../mqtt/mqtt_handler')
var dataBrokerChannel = new mqttHandler('senti-data')
dataBrokerChannel.connect()
const types = ['publish', 'state','config']
router.get('/:version/:customerID/location/:location/registries/:regID/devices/:deviceID/:type', async (req, res, next) => {
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
router.post('/:version/:customerID/location/:location/registries/:regID/devices/:deviceName/:type/', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth
	let data = req.body
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			// res.json('API/httpBridge POST Access Authenticated!')
			console.log('API/httpBridge POST Access Authenticated!')

			//Send the data to DataBroker
			dataBrokerChannel.sendMessage(req.url.substr(1, req.url.length),JSON.stringify({...data, ...req.params }))
			res.status(200).json(true)
		} else {
			res.status(403).json('Unauthorized Access! 403')
			console.log('Unauthorized Access!')
		}
	} else {
		console.log(`API/httpBridge version: ${apiVersion} not supported`)
		res.send(`API/httpBridge version: ${apiVersion} not supported`)
	}
})

router.post('/:version/:customerID/location/:location/registries/:regID/devices/:deviceName/:type/:stateType', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth
	let data = req.body
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			// res.json('API/httpBridge POST Access Authenticated!')
			console.log('API/httpBridge POST Access Authenticated!')

			//Send the data to DataBroker
			dataBrokerChannel.sendMessage(req.url.substr(1, req.url.length),JSON.stringify({...data, ...req.params }))
			res.status(200).json(true)
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
