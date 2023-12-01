const express = require('express');
const authenticateUser = require('../auth');
const { createSuccessResponse } = require('../response');
const { hostname } = require('os');
const { version, author } = require('../../package.json');
const router = express.Router();


router.use('/v1/public', require('./public'));
router.use('/v1/private', authenticateUser, require('./private'));

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




module.exports = router;
