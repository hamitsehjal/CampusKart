const multer = require('multer');


// Configure Storage
const diskStorage = multer.diskStorage({
  // configuration
  destination: 'uploads/',
  filename: (req, file, cb) => {

    const { firstName, lastName } = req.body;
    const customFileName = `${firstName}_${lastName}_${Date.now()}`;
    cb(null, customFileName);
  }
})

// Create an instance of multer
const upload = multer({ storage: diskStorage });

module.exports = upload;
