const { readFileFromS3 } = require("../../config/s3Client");
const logger = require("../../logger");
const { createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  const key = req.params.key;
  try {
    const objectStream = await readFileFromS3(key);

    // Set the 'Content-Type' to 'image/*'
    res.setHeaders('Content-Type', 'image/*');

    res.status(200);
    objectStream.pipe(res);

  } catch (err) {
    logger.error({ err }, `Error handling S3 stream: ${err.message}`);
    return res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
  readFileFromS3(key);
}
