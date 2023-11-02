const { generateS3ImageUrl } = require("../../config/s3Client");
const logger = require("../../logger");
const { StoreCategory } = require("../../models");
const { createErrorResponse, createSuccessResponse } = require("../../response");

/**
 * Fetch store categories from the database and return them
 * 1. fetch categories from database
 * 2. if no categories, return 404
 * 3. else, create pre-signed url for each category image 
 * 4. return categories 
 */
module.exports = async (req, res) => {
    try {
        const categories = await StoreCategory.find({});

        if (categories.length == 0) {
            // No categories found 
            logger.info(`No Categories for Stores Found!!`);

            return res.status(404).json(createErrorResponse(404, `No Categories for Stores Found!!`));
        }
        logger.info(`Categories for Stored Retrieved `);
        logger.debug({ data: categories });

        // Create Pre-signed URLs for the category image 
        for (const category of categories) {
            const url = await generateS3ImageUrl(category.imageName);
            category.imageUrl = url;
        }
        logger.debug({ data: categories });
        return res.status(200).json(createSuccessResponse({
            categories: categories
        }));
    } catch (err) {
        logger.error({ err }, `Error retrieving categories from the Database`);
        return res.status(500).json(createErrorResponse(500, 'Internal Server Error!!'));
    }
}