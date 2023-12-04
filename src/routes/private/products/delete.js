// src/routes/v1/private/delete.js 

const { Product } = require('../../../models');
const { createErrorResponse, createSuccessResponse } = require('../../../response');
const logger = require('../../../logger');
const mongoose = require('mongoose');
/**
 * Delete an existing Product
 * 
 */

module.exports = async (req, res) => {
    // Extract the productId 
    const productId = req.params.productId;
    // const id = new mongoose.SchemaTypes.ObjectId(productId)
    const removedProduct = await Product.findByIdAndRemove(productId);

    if (!removedProduct) {
        logger.error(`No Product Found for id: ${productId}`);
        return res.status(404).json(createErrorResponse(404, `No Product Found!!`));
    }

    logger.info(`Product Removed`, { removedProduct });

    return res.status(200).json(createSuccessResponse({
        message: "Product has been removed!!",
    }))
}