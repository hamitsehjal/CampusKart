const express = require('express');
const { createErrorResponse } = require('./response');


const app = express();

// middleware to parse json requests
app.use(express.json());
// Define routes


// Letting express know to use the routes defined in the 'routes' module
// for any request coming ot root URL
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
        console.log(err);
    }

    const errorResponse = createErrorResponse(errCode, errMsg);

    res.status(errCode).json(errorResponse);

})
module.exports = app;