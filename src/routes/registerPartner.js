const { createErrorResponse, createSuccessResponse } = require('../response');
const { Partner } = require('../models');
const logger = require('../logger');

module.exports = async (req, res) => {
  /**
   * 1. Extract information from the req.body
   * 2. Save it up in the Database
   */
  try {
    const { storeName, storeEmail, storeAddress, storeDescription, contactFirstName, contactLastName } = req.body;

    // Create a new Partner 
    const newPartner = new Partner({
      storeName,
      storeEmail,
      storeAddress,
      storeDescription,
      contactFirstName,
      contactLastName,
    });

    await newPartner.save();
    const successResponse = createSuccessResponse({
      message: "Partner Registration Received",
    });
    logger.info(`Partner Registration Received`, storeEmail);
    return res.status(201).json(successResponse);
  } catch (err) {
    logger.error({ Error: err }, `Couldn't register the Partner`);
    return res.status(422).json(createErrorResponse(422, "Couldn't register the Partner"));
  }
}
