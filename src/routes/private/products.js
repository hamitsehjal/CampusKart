const logger = require("../../logger");
const { Store } = require("../../models");
const { createErrorResponse, createSuccessResponse } = require("../../response");

/**
 * Returns products for a specific stores based on storeId received as route parameter
 * 
 */
module.exports = async (req, res) => {
  /**
   * 1. Extract id from the req object 
   * 2. Retrieve a list of products from products model based on storeId
   */
  const id = req.params.storeId;
  try {
    const products = await Store.find({ storeId: id });

    if (products.length == 0) {
      logger.info(`No Products found for storeId: ${id}`);
      return res.status(404).json(createErrorResponse(404, `No Products found for storeId: ${id}`));
    }
    else {
      logger.info(`Products retrieved for storedId: ${id}`);
      return res.status(200).json(createSuccessResponse({ data: products }));
    }

  } catch (err) {
    logger.error({ err }, `Error retrieving products for storeId: ${id}`);
    return res.status(500).json(createErrorResponse(500, `Internal Server Error`));
  }


}
