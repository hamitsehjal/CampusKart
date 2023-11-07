const express = require('express');
const router = express.Router();


// products
router.get('/products/:storeId', require('./products'));
router.get('/product-categories', require('./productCategories'));

module.exports = router;
