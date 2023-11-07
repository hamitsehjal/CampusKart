const { Store } = require('../../models');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');
const { generateS3ImageUrl } = require('../../config/s3Client');

/** 
 * Fetch the Stores from the Database and return them
 * 1. Extract category from 'req object'
 * 2. If category exists, make query to database for stores of specific category
 * 3. else , query all stores - fetch stores from database
 * 5. if no stores, return 200 with appropriate message
 * 6. else, create pre-signed url for each store image 
 * 7. return stores 
 */
module.exports = async (req, res) => {
  try {
    const category = req.query.category || "all";
    let stores = []
    if (category === 'all') {
      stores = await Store.find({});
    }
    else {
      stores = await Store.find({ category: category });
    }
    if (stores.length == 0) {
      logger.info(`No Stores Found!!`);
      return res.status(200).json(createSuccessResponse({ stores: stores }));
    }
    else {
      logger.info(`Stores Retrieved!!`);
      logger.debug({ data: stores });
      // Create presigned URL for store images 
      for (const store of stores) {
        const url = await generateS3ImageUrl(store.imageName);
        store.imageUrl = url;
      }
      logger.debug({ data: stores });
      return res.status(200).json(createSuccessResponse({ stores: stores }));
    }
  } catch (err) {
    logger.error({ err }, `Error retrieving Stores from Database`);
    return res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
}
