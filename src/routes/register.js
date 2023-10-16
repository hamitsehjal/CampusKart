// src/routes/api/register.js 
const { createErrorResponse, createSuccessResponse } = require('../response');
const { User } = require('../models');
const logger = require('../logger');
module.exports = async (req, res) => {
  /*
    1. Check if email address is already registered
      - If yes, return error 
    2. Try to make a new User 
  */
  try {

    // Extract required properties and rest from request's body
    const { name, email, password, studentId, ...rest } = req.body;
    const profile = rest.profile || "https://www.personality-insights.com/wp-content/uploads/2017/12/default-profile-pic-e1513291410505.jpg";

    // Check if email is already registered
    const user = await User.findOne({ email });
    if (user) {
      logger.info(`Couldn't create Account: Email already Exists!!`);
      return res.status(422).json(createErrorResponse(422, "Account already Exist"));
    }

    // Create a new User 
    const newUser = new User(
      {
        name,
        email,
        password,
        studentId,
        profile
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


