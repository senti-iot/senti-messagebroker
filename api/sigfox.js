const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
var mqttHandler = require('../mqtt/mqtt_handler')
var dataBrokerChannel = new mqttHandler('senti-data')
dataBrokerChannel.connect()
// console.log(server)
// let dataBrokerChannel = server.dataBrokerChannel
// console.log(dataBrokerChannel)
// var mqttHandler = require('../mqtt/mqtt_handler');

// var receiveData = new mqttHandler('senti-messagebroker');

// receiveData.connect();

// dataBrokerChannel.connect();

/* get template */
router.get('//mb', async (req,res, netxt)=> {
	res.json('API/MessageBroker /messagebroker GET Success!')
})
router.get('/:version/', async (req, res, next) => {
	let apiVersion = req.params.version

	let authToken = req.headers.auth
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {
			res.json('API/sigfox GET Access Authenticated!')
		} else {
			res.status(403).json('Unauthorized Access! 403')
			console.log('Unauthorized Access!')
		}
	} else {
		console.log(`API/sigfox version: ${apiVersion} not supported`)
		res.send(`API/sigfox version: ${apiVersion} not supported`)
	}
})

router.post('/:version', async (req, res, next) => {
	let apiVersion = req.params.version
	let authToken = req.headers.auth
	let data = req.body
	if (verifyAPIVersion(apiVersion)) {
		if (authenticate(authToken)) {

			res.json('API/sigfox POST Access Authenticated!')
			console.log('API/sigfox POST Access Authenticated!')

			//Send the data to DataBroker
			dataBrokerChannel.sendMessage(`${JSON.stringify(data)}`)
		} else {
			res.status(403).json('Unauthorized Access! 403')
			console.log('Unauthorized Access!')
		}
	} else {
		console.log(`API/sigfox version: ${apiVersion} not supported`)
		res.send(`API/sigfox version: ${apiVersion} not supported`)
	}
})
// router.get('/', async (req,res, netxt)=> {
// 	res.json('API/MessageBroker GET Success!')
// })
module.exports = router
