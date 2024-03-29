const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
// var mqttHandler = require('../mqtt/mqtt_handler')
// var dataBrokerChannel = new mqttHandler('senti-data')
// dataBrokerChannel.connect()

const secureMqttClient = require('../server').secureMqttClient

// const log = require('../server').log
const logger = require('../logger/index').log

const types = ['publish', 'state', 'config']

const parseBearerToken = (req) => {
	const auth = req.headers ? req.headers.authorization || null : null
	if (!auth) {
		return null
	}

	const parts = auth.split(' ')
	// Malformed header.
	if (parts.length < 2) {
		return null
	}

	const schema = parts.shift().toLowerCase()
	const token = parts.join(' ')
	if (schema !== 'bearer' && schema !== 'basic') {
		return null
	}
	return token
}

router.post('/:version/:customerID/location/:location/registries/:regID/:type', async (req, res) => {
	let apiVersion = req.params.version
	let authToken = parseBearerToken(req)
	if (authToken === null) {
		authToken = (req.headers.auth) ? req.headers.auth : req.query.auth
	}

	let data = req.body
	// console.log('Before 400', req.path, data)
	if (typeof data === 'string') {
		try {
			data = JSON.parse(data)
		}
		catch (e) {
			console.log('Invalid Data package', req.body)
			res.send('Invalid Data package').status(400)
		}
	}
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			// res.json('API/httpBridge POST Access Authenticated!')
			//console.log('API/httpBridge POST Access Authenticated!')

			//Send the data to DataBroker
			// console.log(req.url.substr(1, req.url.length),JSON.stringify(data))
			// console.log(req.headers)
			//dataBrokerChannel.sendMessage(req.url.substr(1, req.url.length), JSON.stringify(data))
			secureMqttClient.sendMessage(req.path.substr(1, req.path.length), JSON.stringify(data))
			res.status(200).json()
		} else {
			let uuid = await logger({
				msg: 'Unauthorized access atempted',
				data: data
			}, 'warn')
			res.status(403).json('Unauthorized Access! 403 ' + uuid)
			console.log('Unauthorized Access!')
			console.log(req.params)
			console.log(req.headers)
			console.log(req.body)
		}
	} else {
		console.log(`API/httpBridge version: ${apiVersion} not supported`)
		res.send(`API/httpBridge version: ${apiVersion} not supported`)
	}
})
router.post('/:version/:customerID/location/:location/registries/:regID/devices/:deviceName/:type', async (req, res) => {
	let apiVersion = req.params.version
	let authToken = parseBearerToken(req)
	if (authToken === null) {
		authToken = (req.headers.auth) ? req.headers.auth : req.query.auth
	}
	let data = req.body
	if (typeof data === 'string') {
		try {
			data = JSON.parse(data)
		}
		catch (e) {
			console.log('Invalid Data package', req.body)
			res.send('Invalid Data package').status(400)
		}
	}
	// req.log.info("Received data from:", req.url)
	// log.info("Received data from:", req.url)
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			// res.json('API/httpBridge POST Access Authenticated!')
			//console.log('API/httpBridge POST Access Authenticated!')

			//Send the data to DataBroker
			// console.log(req.url.substr(1, req.url.length),JSON.stringify({...data, ...req.params }))
			// dataBrokerChannel.sendMessage(req.url.substr(1, req.url.length), JSON.stringify({ ...data }))
			secureMqttClient.sendMessage(req.path.substr(1, req.path.length), JSON.stringify({ ...data }))
			res.status(200).json()
		} else {
			res.status(403).json('Unauthorized Access! 403')
			console.log('Unauthorized Access!', data, req.url, req.headers)
		}
	} else {
		console.log(`API/httpBridge version: ${apiVersion} not supported`)
		res.send(`API/httpBridge version: ${apiVersion} not supported`)
	}
})



module.exports = router
