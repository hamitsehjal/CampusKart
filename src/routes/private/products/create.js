// src/routes/v1/private/create.js 

const { Product } = require('../../../models');
const { createErrorResponse, createSuccessResponse } = require('../../../response');
const logger = require('../../../logger');

const { uploadFileToS3 } = require('../../../config/s3Client');

/**
 * 
 * Create a new product
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
        // Extract storeId 
        const store = req.params.storeId;

        // Extract required properties 
        const { name, price, quantity, category } = req.body;
        let imageName = ""

        if (req.file) {
            const productImage = req.file;

            console.log('Multer File', productImage);
            imageName = await uploadFileToS3(productImage, 'products');
            if (!imageName) {
                logger.error(`Error Uploading File to S3`);
                throw new Error(`Error Uploading File to S3`);
            }
        } else {
            imageName = "products/default_product"
        }

        // create new Product 
        const newProduct = new Product(
            {
                store: store,
                name: name,
                category: category,
                price: price,
                imageName: imageName,
                quantity: quantity,
            }
        );

        await newProduct.save();
        const successResponse = createSuccessResponse({
            message: "Product Created",
        })
        logger.info(`New Product created for Store with id: ${store}`);
        return res.status(201).json(successResponse);
    } catch (error) {
        logger.error({ error }, `Error occurred while creating a New Product`);
        return res.status(500).json(createErrorResponse(500, `Internal Server Error`));

    }
}