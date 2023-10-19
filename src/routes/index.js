const express = require('express');
const authenticateUser = require('../auth');
const { createSuccessResponse } = require('../response');
const { hostname } = require('os');
const { version, author } = require('../../package.json');
const upload = require('../upload');

const router = express.Router();


// Any routes defined in 'api' module will be accessible under '/v1' prefix
router.use('/v1', authenticateUser, require('./api'));


// Health Check Route

router.get('/', (req, res) => {

  // Disable cache (Client should never cache this result - always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  const successResponse = createSuccessResponse(
    {
      author,
      version,
      hostname: hostname(),
    }
  )
  res.status(200).json(successResponse);

});

// Register Route
router.post('/register-user', upload.single('profile'), require('./register'));

// login route
router.post('/login', require('./login'));

// Register Partner
router.post('/register-partner', require('./registerPartner'));

module.exports = router;
