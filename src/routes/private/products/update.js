// src/routes/v1/private/create.js 

const { Product } = require('../../../models');
const { createErrorResponse, createSuccessResponse } = require('../../../response');
const logger = require('../../../logger');

const { uploadFileToS3 } = require('../../../config/s3Client');

/**
 * 
 * Update an existing product
 * - upload product image to AWS S3
 * - Product data in MongoDB 
 * Example Product:
 * ```
 * {
    "store": "6569017fcfed7b4963f8258c",
    "name": "Banana",
    "category": "Fruits",
    "price": "3.5",
    "imageName": "products/real-canadian-superstore_banana",
    "quantity": 50
  }
 * ```
 * 
 */

module.exports = async (req, res) => {

    try {
        // Extract productId 
        const productId = req.params.productId;

        // Extract required properties 
        const { name, price, quantity, category } = req.body;


        let imageName = ''

        if (req.file) {
            const productImage = req.file;

            console.log('Multer File', productImage);
            imageName = await uploadFileToS3(productImage, 'products');
            if (!imageName) {
                imageName = ''
                logger.error(`Error Uploading File to S3`);
                throw new Error(`Error Uploading File to S3`);
            }
        }

        const update = imageName === '' ? {
            name: name,
            category: category,
            price: price,
            quantity: quantity,
        } : {
            name: name,
            category: category,
            price: price,
            imageName: imageName,
            quantity: quantity,
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, update, {
            new: true,
        })
        const successResponse = createSuccessResponse({
            message: "Product updated",
            product: updatedProduct,
        })
        logger.info(`Product has been updated for Product Id: ${productId}`);
        return res.status(201).json(successResponse);
    } catch (error) {
        logger.error({ error }, `Error occurred while creating a New Product`);
        return res.status(500).json(createErrorResponse(500, `Internal Server Error`));

    }
}