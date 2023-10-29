const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');


const { createErrorResponse } = require('./response');
const logger = require('./logger');
const pino = require('pino-http')(
  {
    // Use our default logger, that is already configured
    logger,
  }
)

const app = express();
// Use pino for structured logging
app.use(pino);

// security middleware
app.use(helmet());

// middleware to parse json requests
app.use(express.json());

// enables cross-site resource sharing
app.use(cors())

// compress the response headers

app.use(compression());
// Define routes


// Letting express know to use the routes defined in the 'routes' module
// for any request coming of root URL
app.use('/', require('./routes'));


// Catch-All Routes for unmatched URLs 
app.use((req, res) => {
  const errorResponse = createErrorResponse(404, "Resource doesn't exist!!")
  res.status(404).json(errorResponse);
})

// Error Handling Middleware
app.use((err, req, res) => {
  const errCode = err.statusCode || 500;
  const errMsg = err.statusMessage || 'Unable to process Request';

  // If there is any server error, we want to see what's happening
  if (errCode > 499) {
    logger.error({ err }, `Error processing request`);
  }

  const errorResponse = createErrorResponse(errCode, errMsg);

  res.status(errCode).json(errorResponse);

})
module.exports = app;
