const express = require('express');
const upload = require('../../upload');
const router = express.Router();


// products-categories
router.get('/product-categories', require('./productCategories'));

// products

// create a New Product
router.post('/products', upload.single('profile'), require('./products/create'));
// get All Products
router.get('/products/:storeId', require('./products/findAll'));

// Get one Product 
router.get('/products/:productId', require('./products/findOne'));


// Update an Existing Product 
router.put('/products/:productId', upload.single('profile'), require('./products/update'));

// Delete a Product

module.exports = router;