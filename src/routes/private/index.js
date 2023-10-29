const express = require('express');
const router = express.Router();


router.get('/stores', require('./stores'));

router.get('/products/:storeId', require('./products'));

module.exports = router;
