const mongoose = require('mongoose');
const logger = require('../logger');

exports.connectToDatabase = () => {
  const URI = process.env.MONGODB_URI;
  mongoose.connect(URI, {
    dbName: "campus-cart-app",
    useNewUrlParser: true, // use new URL parser of MongoDB Driver
    useUnifiedTopology: true, // use new server Discovery and Monitoring Engine
  }).then(() => {
    logger.info(`DB Connected Successfully`)
  }).catch((error) => {
    logger.debug({ error: error.stack }, `DB Connection Failed`);
    process.exit(1);
  })

}
