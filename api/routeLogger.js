const express = require('express');
const router = express.Router();

router.all('*', (req, res, next) => {
	console.log('Path:', req.path)
	console.log('Body:', req.body)
});

module.exports = router