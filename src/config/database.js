const mongoose = require('mongoose');
const logger = require('../logger');
require('dotenv').config();

async function connectToDatabase() {
  try {

    const { MONGODB_URI } = process.env

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  } catch (error) {
    logger.error({ error }, `Error Connecting to MongoDB`)
  }
}

module.exports = connectToDatabase;
