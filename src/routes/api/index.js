const express = require('express');
const { readFileFromS3 } = require('../../config/s3Client');
const router = express.Router();

// Profile Images for Users 
router.get('/images/:key(*)', (req, res) => {
  const key = req.params.key;

  const objectStream = readFileFromS3(key);

  objectStream.pipe(res);
});

router.get('/stores', (req, res) => {
  res.status(200).json({ "message": "Stores Coming!!!" })
})

module.exports = router;
