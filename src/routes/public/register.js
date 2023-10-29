// src/routes/api/register.js 
const { createErrorResponse, createSuccessResponse } = require('../../response');
const { User } = require('../../models');
const logger = require('../../logger');
const { uploadFileToS3 } = require('../../config/s3Client');
module.exports = async (req, res) => {
  /*
    1. Check if email address is already registered
      - If yes, return error 
    2. Try to make a new User 
  */
  try {

    // Extract required properties and rest from request's body
    const { firstName, lastName, email, password, studentId } = req.body;
    // Check if email is already registered
    const user = await User.findOne({ email });
    if (user) {
      logger.info(`Couldn't create Account: Email already Exists!!`);
      return res.status(422).json(createErrorResponse(422, "Account already Exist"));
    }
    let imageName = "";
    if (req.file) {
      const profile = req.file;

      console.log('Multer File', profile);
      imageName = await uploadFileToS3(profile);
      if (!imageName) {
        throw new Error('Error Uploading File to S3');
      }

    } else {
      imageName = "users/default_user"
    }


    // Create a new User 
    const newUser = new User(
      {
        firstName,
        lastName,
        email,
        password,
        studentId,
        imageName
      }
    );
    await newUser.save();
    const successResponse = createSuccessResponse({
      message: "Account Created!!"
    })
    logger.info(`New Account Created for Email: ${email}`);
    res.status(201).json(successResponse);
  } catch (err) {
    logger.error(`Couldn't create Account, ${err}`);
    return res.status(422).json(createErrorResponse(422, "Couldn't create Account!!"));
  }

}



