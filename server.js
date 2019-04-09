#!/usr/bin/env nodejs
const dotenv = require('dotenv').load()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const mqttHandler = require('./mqtt/receiveData')
const receiveData = new mqttHandler('senti-messagebroker')
receiveData.connect()

// API endpoint imports
// const indexRouter = require('./api/index')
// const weatherRouter = require('./api/weather')
// const holidaysRouter = require('./api/holidays')
// const annualRouter = require('./api/annual')
// const apiVersionRouter = require('./api/apiversion')
// const templateRouter = require('./api/template')
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
		console.log('Senti Message Broker server started on port:', port)
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