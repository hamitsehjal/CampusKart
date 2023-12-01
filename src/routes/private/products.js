const logger = require("../../logger");
const { Product, Store } = require("../../models");
const { uploadFileToS3 } = require("../../config/s3Client");
const { createErrorResponse, createSuccessResponse } = require("../../response");

module.exports = {
  // Route for retrieving products based on storeId
  getProducts: async (req, res) => {
    const id = req.params.storeId;
    try {
      const products = await Product.find({ storeId: id });

      if (products.length === 0) {
        logger.info(`No Products found for storeId: ${id}`);
        return res.status(404).json(createErrorResponse(404, `No Products found for storeId: ${id}`));
      } else {
        logger.info(`Products retrieved for storeId: ${id}`);
        return res.status(200).json(createSuccessResponse({ data: products }));
      }
    } catch (err) {
      logger.error({ err }, `Error retrieving products for storeId: ${id}`);
      return res.status(500).json(createErrorResponse(500, `Internal Server Error`));
    }
  },

  // Route for creating a new product
  createProduct: async (req, res) => {
    try {
      const storeId = req.user.storeId; // Assuming you store the store ID in the user object after authentication.
      const { name, description, price, stockQuantity, image, category } = req.body;

      const s3ImageUrl = await uploadFileToS3(image);

      const newProduct = new Product({
        storeId,
        name,
        description,
        price,
        stockQuantity,
        image: s3ImageUrl, // S3 URL 
        category,
      });

      const savedProduct = await newProduct.save();

      logger.info(`Product created for storeId: ${storeId}`);
      return res.status(201).json(createSuccessResponse({ data: savedProduct }));
    } catch (err) {
      logger.error({ err }, "Error creating a product");
      return res.status(500).json(createErrorResponse(500, "Internal Server Error"));
    }
  },
};
