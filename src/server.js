// /src/server.js

const stoppable = require('stoppable');
const app = require('./app');
const db = require('./config/database');
const logger = require('./logger');


const PORT = parseInt(process.env.PORT || 8080, 10);

const server = stoppable(
  app.listen(PORT, () => {
    logger.info({ PORT }, `Server Started`)
    db.connectToDatabase();
  }))


module.exports = server;
