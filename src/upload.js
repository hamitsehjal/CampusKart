const multer = require('multer');


// Configure Storage
const memoryStorage = multer.memoryStorage();

// Create an instance of multer
const upload = multer({ storage: memoryStorage });

module.exports = upload;
