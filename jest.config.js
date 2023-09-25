const path = require('path');
const envFile = path.join(__dirname, 'env.jest');
require('dotenv').config({
  path: envFile,
})

console.log(`Using LOG_LEVEL=${process.env.LOG_LEVEL}. Use 'debug' to see logs in detail`)
module.exports = {
  verbose: true,
  testTimeout: 5000,
}
