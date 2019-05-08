#!/usr/bin/env nodejs
const dotenv = require('dotenv').load()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const pino = require('pino')
const fs = require('fs')
module.exports.logger=pino(pino.destination(`/var/log/nodejs/messagebroker/${new Date().toLocaleDateString().replace(/\//g, '-')}-others.json`))
const logger=pino(pino.destination(`/var/log/nodejs/databroker/${new Date().toLocaleDateString().replace(/\//g, '-')}.json`))

// const mqttHandler = require('./mqtt/receiveData')
const expressPino = require('express-pino-logger')({
	logger: logger
})
app.use(expressPino)

const httpBridge = require('./api/httpBridge')

const port = process.env.NODE_PORT || 3001

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


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
		console.log('Senti Rules Engine server started on port:', port)
	}).on('error', (err) => {
		if (err.errno === 'EADDRINUSE') {
			console.log('Server not started, port ' + port + ' is busy')
		} else {
			console.log(err)
		}
	})
}

startAPIServer()

//#region MQTT


//#endregion