const logger = require("../../../logger");
const { Product } = require("../../../models");
const { createErrorResponse, createSuccessResponse } = require("../../../response");
const { generateS3ImageUrl } = require('../../../config/s3Client');


/**
 * Retrieve a product from Database
 */

module.exports = async (req, res) => {

    try {
        // extract the product id 
        const id = req.params.productId;

        // Retrieve the Product
        const product = await Product.findById(id);

        // No Product found
        if (!product) {
            logger.info(`No product Found!!`);
            return res.status(404).json(createErrorResponse(404, `No Product Found!!`))
        }

        logger.info(`Product Retrieved`, { product })

        // Generate Pre-signed URL for the product image 
        const url = await generateS3ImageUrl(product.imageName);
        product.imageUrl = url;

        logger.debug({ data: product });

        // Return the Product
        return res.status(200).json(createSuccessResponse({
            product: product,
        }))
    } catch (err) {
        logger.error({ err }, `Error retrieving product`);
        return res.status(500).json(createErrorResponse(500, `Internal Server Error`))
    }
}