const express = require('express');
const router = express.Router();



router.get('/products/:storeId', require('./products'));

module.exports = router;
