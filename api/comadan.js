const express = require('express')
const router = express.Router()
const verifyAPIVersion = require('senti-apicore').verifyapiversion
const { authenticate } = require('senti-apicore')
const secureMqttClient = require('../server').secureMqttClient
var mysqlConn = require('../mysql/mysql_handler')


router.post('/v1/comadan-application', async (req, res, next) => {
	let apiVersion = 'v1'
	console.log('comadan-application.bytesRead', req.socket.bytesRead)
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
			console.log('/v1/comadan-application ok')
			console.log(data)
			secureMqttClient.sendMessage(req.path.substr(1, req.path.length), JSON.stringify(data))
			let result = ""
			if (data.recv === true) {
				let select = `SELECT d.metadata
								FROM device d
								WHERE d.uuname = ? AND d.deleted = 0;`
				let rs = await mysqlConn.query(select, [data.ID])
				console.log(rs[0][0].metadata)
				if (rs[0].length === 1) {
					result = rs[0][0].metadata
				}
			}
			res.status(200).json(result)
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