const logger = require("../../../logger");
const { Product } = require("../../../models");
const { createErrorResponse, createSuccessResponse } = require("../../../response");
const { generateS3ImageUrl } = require('../../../config/s3Client');
/**
 * Returns products for a specific stores based on storeId received as route parameter
 * 
 */
module.exports = async (req, res) => {
  /**
   - Extract id from the req object 
   - Extract 'category' from query parameters
   - Retrieve a list of products from products model based on storeId
      - if category doesn't exists, fetch all products
      - else fetch products of specific category
   - If no products found, return 200 with appropriate message
   - else, generate pre-signed url for each product image
   - return 200 with products object
   */
  const id = (req.params.storeId);
  logger.debug({ "store_id": id });
  const category = req.query.category || "all";
  let products = []
  try {
    if (category == "all") {
      products = await Product.find({ store: id }).populate({
        path: 'store',
        select: '_id name',
      });
    }
    else {
      products = await Product.find({
        store: id,
        category: category,
      }).populate({
        path: 'store',
        select: '_id name',
      });
    }

    if (products.length == 0) {
      logger.info(`No Products found for store_id: ${id} with category: ${category}`);
      // return res.status(404).json(createErrorResponse(404, `No Products found for store_id: ${id} with category: ${category}`));
      return res.status(200).json(createSuccessResponse({ products: products }));
    }

    logger.info(`Products retrieved for store_id: ${id} with category: ${category}`);
    logger.debug({ data: products });

    // Create pre-signed URLs for product images
    for (const product of products) {
      const url = await generateS3ImageUrl(product.imageName);
      product.imageUrl = url;
    }
    logger.debug({ data: products });
    return res.status(200).json(createSuccessResponse({ products: products }));

  } catch (err) {
    logger.error({ err }, `Error retrieving products for store_id: ${id} and category: ${category}`);
    return res.status(500).json(createErrorResponse(500, `Internal Server Error`));
  }


}
