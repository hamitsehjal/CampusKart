const express = require('express');

const router = express.Router();

const upload = require('../../upload');

// login route
router.post('/login', require('./login'));
// Register Route
router.post('/register-user', upload.single('profile'), require('./register'));


// Register Partner
router.post('/register-partner', require('./registerPartner'));

// Stores 
router.get('/stores', require('./stores'));
router.get('/store-categories', require('./storeCategories'));

// login to store
router.get('/store-login', require('./storeLogin'));

module.exports = router;
