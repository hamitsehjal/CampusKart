const express = require('express');

const router = express.Router();

const upload = require('../../upload');

// images routes
// router.get('/images/stores/:key', require('./s3Images'));
// router.get('/images/users/:key', require('./s3Images'));
router.get('/images/:key', require('./s3Images'));

// login route
router.post('/login', require('./login'));
// Register Route
router.post('/register-user', upload.single('profile'), require('./register'));


// Register Partner
router.post('/register-partner', require('./registerPartner'));
module.exports = router;
