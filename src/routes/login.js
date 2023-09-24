// src/routes/login.js 

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { createErrorResponse, createSuccessResponse } = require('../response');
const logger = require('../logger');

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(createErrorResponse(400, 'Invalid Data'));
    }
    const user = await checkUser(email, password);

    // User is logged in, create JWT TOKEN
    jwt.sign({ user }, 'secret', { expiresIn: '1h' }, (err, token) => {
      if (err) {
        logger.error({ err }, `Error creating Tokens!`)
        return res.status(500).json(createErrorResponse(500, 'Error creating Tokens!!'))
      }
      const successResponse = createSuccessResponse({
        "message": "Logged In",
        "token": token,
      });
      res.status(200).json(successResponse);
    })

  } catch (err) {
    logger.error({ err }, `${err.message}`);
    return res.status(401).json(createErrorResponse(401, "Unauthorized"));
  }

}

async function checkUser(email, password) {
  /**
   * 1. data consists of emailAddress and password
   * 2. Find the user based on emailAddress from database
   *      - If exists, retrieve and match password 
   *          - If matches, return the user object
   *          - Doesn't match, throw an error
   *      - Doesn't exist, throw an error
   */

  try {
    logger.info({ "user": email }, "User's Info");

    const user = await User.findOne({ emailAddress: email }).exec();
    if (!user) {
      logger.error(`FAILED: User ${email} WAS NOT FOUND`)
      throw new Error(`FAILED: User ${email} WAS NOT FOUND`)
    }

    // Perform the match
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return user;
    }
    else {
      logger.err(`Passwords doesn't match`)
      throw new Error(`FAILED: Passwords doesn't match`)
    }

  } catch (err) {
    logger.err(`Error: ${err.message}`)
    throw new Error(`Error: ${err.message}`)
  }


}
