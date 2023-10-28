// const S3 = require('aws-sdk/clients/s3');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const logger = require('../logger');
const bucketName = process.env.AWS_S3_BUCKET;

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

const getS3Endpoint = () => {
  if (process.env.AWS_S3_ENDPOINT_URL) {
    logger.debug({ endpoint: process.env.AWS_S3_ENDPOINT_URL }, `Using Alternate S3 Endpoint`);
    return process.env.AWS_S3_ENDPOINT_URL;
  }
}

// Configure AWS S3 
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: getCredentials,
  endpoint: getS3Endpoint,
  // We want to use path-style URLs as opposed to virtual-host-type URL
  forcePathStyle: true,
});
// Upload a file to S3 
async function uploadFileToS3(file) {
  const fileStream = fs.createReadStream(file.path);
  const params = {
    Bucket: bucketName,
    Key: `users/${file.filename}`,
    Body: fileStream,
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

// Retrieve a file from S3
async function readFileFromS3(fileKey) {

  const params = {
    Bucket: bucketName,
    Key: fileKey,
  }
  // Create a GET Object command to S3
  const command = new GetObjectCommand(params);

  try {
    const response = await s3.send(command);

    // return the readable stream for the object's data
    return response.Body;
  } catch (err) {
    logger.error({ error: err }, `Error retrieving file from S3`);
    throw new Error(`Unable to retrieve file from S3`);
  }
}
module.exports.uploadFileToS3 = uploadFileToS3;
module.exports.readFileFromS3 = readFileFromS3;
