const { generateS3ImageUrl } = require('../../config/s3Client');
const logger = require('../../logger');

const { ProductCategory } = require('../../models');
const { createErrorResponse, createSuccessResponse } = require('../../response');

/** 
 - Fetch Product Categories from Database
  - fetch categories from database
  - IF no categories, return 404
  - ELSE, create pre-signed URLs for categories Images
  - return 200 and categories
*/

module.exports = async (req, res) => {
  try {
    const categories = await ProductCategory.find({});

    if (categories.length == 0) {
      // no categories found
      return res.status(404).json(createErrorResponse(404, 'No Product Categories Found!!'));
    }
    logger.info(`Categories for Products Retrieved!!`);
    logger.debug({ data: categories });

    // Create Pre-signed Urls for the category images

    for (const category of categories) {
      const url = await generateS3ImageUrl(category.imageName);
      category.imageUrl = url;
    }

    logger.debug({ data: categories });

    return res.status(200).json(createSuccessResponse({
      categories: categories
    }));

  } catch (err) {
    logger.error({ err }, `Error retrieving product categories from the Database`);
    return res.status(500).json(createErrorResponse(500, 'Internal Server Error!!'));
  }
}