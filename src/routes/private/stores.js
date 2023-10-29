const { Store } = require('../../models');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');
/** 
 * Fetch the Stores from the Database and return them
 */
module.exports = async (req, res) => {
  try {
    const stores = await Store.find({});

    if (stores.length == 0) {
      logger.info(`No Stores Found!!`);
      return res.status(404).json(createErrorResponse(404, 'No Stores Found'));
    }
    else {
      logger.info(`Stores Retrieved!!`);
      return res.status(200).json(createSuccessResponse({ data: stores }));
    }
  } catch (err) {
    logger.error({ err }, `Error retrieving Stores from Database`);
    return res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
}
