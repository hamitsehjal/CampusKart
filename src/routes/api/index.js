const express = require('express');

const router = express.Router();


router.get('/stores', (req, res) => {
  res.status(200).json({ "message": "Stores Coming!!!" })
})

module.exports = router;
