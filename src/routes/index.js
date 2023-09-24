const express = require('express');
const { createSuccessResponse } = require('../response');
const { hostname } = require('os');
const { version, author } = require('../../package.json');
const router = express.Router();


// Any routes defined in 'api' module will be accessible under '/v1' prefix
router.use('/v1', require('./api'));

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