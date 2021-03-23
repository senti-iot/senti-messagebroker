const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
const secureMqttClient = require('../server').secureMqttClient

router.post('/v1/comadan-application', async (req, res, next) => {
	let apiVersion = 'v1'
	authToken = (req.headers.auth) ? req.headers.auth : req.query.auth
	let data = req.body
	if (typeof data === 'string') {
		try {
			data = JSON.parse(data)
		}
		catch (e) {
			console.log('Comadan Invalid Data package', req.body)
			res.send('Invalid Data package').status(400)
		}
	}
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			//Send the data to DataBroker
			secureMqttClient.sendMessage(req.path.substr(1, req.path.length), JSON.stringify(data))
			res.status(200).json()
		} else {
			res.status(403).json('Unauthorized Access! 403')
			console.log('Comadan Unauthorized Access!')
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