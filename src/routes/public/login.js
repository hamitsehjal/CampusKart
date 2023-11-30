// src/routes/login.js 

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../../models');
const { createErrorResponse, createSuccessResponse } = require('../../response');
const logger = require('../../logger');
const { generateS3ImageUrl } = require('../../config/s3Client');

module.exports = async (req, res) => {
  /**
   * 1. Extract email and password (Both are required)
   * 2. Check if our database has existing user with the 'email'
   *  - If no, return up the error response 
   * 3. Compare up the password 
   * 4. If Matches, return JWT Token 
   */
  try {
    const { email, password } = req.body;

    // check if account exists 
    const user = await User.findOne({ email });

    if (!user) {
      logger.info(`Account doesn't exist for email: ${email}`);
      return res.status(422).json(createErrorResponse(422, `LOGIN FAILED: Account Doesn't Exist for ${email}`));
    }

    // Compare password 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.info(`LOGIN FAILED: Passwords doesn't Matches`)
      return res.status(422).json(createErrorResponse(422, `LOGIN FAILED: Passwords doesn't Matches`));
    }

    // Authentication Completes, Create JWT Token 
    const name = `${user.firstName} ${user.lastName}`;
    const token = jwt.sign({ user_id: user._id, user_name: name }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logger.debug({ Token: token }, `Token Issued to User`);

    // Create pre-signed URL for user image 
    const url = await generateS3ImageUrl(user.imageName);

    const successResponse = createSuccessResponse({
      "token": token,
      "message": "Logged In",
      "profileUrl": url,
    })
    return res.status(200).json(successResponse);

  } catch (err) {
    logger.error({ err }, `${err.message}`);
    return res.status(401).json(createErrorResponse(401, "Error Logging In"));
  }

}

