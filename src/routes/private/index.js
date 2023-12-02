const express = require('express');
const upload = require('../../upload');
const router = express.Router();


// products-categories
router.get('/product-categories', require('./productCategories'));

// products

// get All Products
router.get('/products/:storeId', require('./products/findAll'));

// Get one Product 
router.get('/products/:productId', require('./products/findOne'));

// create a New Product
router.post('/products/:storeId', upload.single('productImage'), require('./products/create'));

// Update an Existing Product 
router.post('/products/:productId', upload.single('productImage'), require('./products/update'));

// Delete a Product

module.exports = router;