
const crypto = require('crypto');
const sharp = require('sharp');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const logger = require('../logger');

const bucketName = process.env.AWS_S3_BUCKET;

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
const getCredentials = () => {
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    const credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
    logger.debug(`Using S3 credentials: ACCESS-KEY-ID: ${process.env.AWS_ACCESS_KEY_ID}`)
    return credentials;
  }
  else {
    logger.debug(`S3 credentials not Loaded!!!`)
  }
}


// Configure AWS S3 
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: getCredentials,
  // We want to use path-style URLs as opposed to virtual-host-type URL
  forcePathStyle: true,
});


// Upload a file to S3 
async function uploadFileToS3(file,) {
  const { buffer, mimetype } = file;
  // resize the image 
  const resizedImage = await sharp(buffer).resize({
    height: 1920,
    width: 1080,
    fit: 'contain'
  }).toBuffer();

  const imageName = randomImageName();
  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: resizedImage,
    ContentType: mimetype,
  }
  // Create a PUT Object Command to send to S3 
  const command = new PutObjectCommand(params);
  try {
    const data = await s3.send(command);
    logger.debug({ response: data }, `Response from S3 File Upload Process`);
    const { Key } = params;
    return Key;
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, `Error Uploading File to S3`);
    throw new Error(`Unable to upload File to S3`);
  }

}

// Create Presigned URL for Images
async function generateS3ImageUrl(fileKey) {
  logger.debug(`S3 Key Received: ${fileKey}`);
  const params = {
    Bucket: bucketName,
    Key: fileKey,
  }
  // Create a GET Object command to S3
  const command = new GetObjectCommand(params);

  try {
    // Generate pre-signed url for S3 Image
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    logger.info(`Presigned URL: ${url}`);
    return url;
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, `Error generating URL for S3 Image`);
    throw new Error(`Error generating URL for S3 Image`);
  }
}
module.exports.uploadFileToS3 = uploadFileToS3;
module.exports.generateS3ImageUrl = generateS3ImageUrl;
