const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
const secureMqttClient = require('../server').secureMqttClient

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

router.post('/v1/prefix-handler/:config/:uuname', async (req, res, next) => {
	let apiVersion = 'v1'
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
			console.log('EFENTO Invalid Data package', req.body)
			res.send('Invalid Data package').status(400)
		}
	}
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			// res.json('API/httpBridge POST Access Authenticated!')
			console.log('API/httpBridge POST Access Authenticated!')
			//Send the data to DataBroker
			let topic = 'v2/prefix-handler/' + req.params.config + '/' + req.params.uuname
			secureMqttClient.sendMessage(topic, JSON.stringify(data))
			res.status(200).json()
		} else {
			res.status(403).json('Unauthorized Access! 403')
			console.log('EFENTO Unauthorized Access!')
			console.log(req.params)
			console.log(req.headers)
			console.log(req.body)
		}
	} else {
		console.log(`API/httpBridge version: ${apiVersion} not supported`)
		res.send(`API/httpBridge version: ${apiVersion} not supported`)
	}
})
module.exports = router