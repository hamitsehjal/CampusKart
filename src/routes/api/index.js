const express = require('express');
const { readFileFromS3 } = require('../../config/s3Client');
const router = express.Router();

// Profile Images for Users 
router.get('/images/:key(*)', (req, res) => {
  const key = req.params.key;

  const objectStream = readFileFromS3(key);

  objectStream.pipe(res);
});

router.get('/stores', require('./stores'));

router.get('/products/:storeId', require('./products'));

module.exports = router;
