const { readFileFromS3 } = require("../../config/s3Client");
const logger = require("../../logger");
const { createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  const key = req.params.key;
  const s3Key = `${key}`;
  // const s3Key = `users/${key}`;
  logger.info(`Image Key: ${s3Key}`)
  try {
    const objectStream = await readFileFromS3(s3Key);

    res.status(200);
    objectStream.pipe(res);

  } catch (err) {
    logger.error({ err }, `Error handling S3 stream: ${err.message}`);
    return res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
}
