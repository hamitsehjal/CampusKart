const logger = require('../logger');
const jwt = require('jsonwebtoken');
const { createErrorResponse } = require('../response');
module.exports = (req, res, next) => {
  /**
   * 1. Extract the token from the authorization header 
   * 2. Verify the token 
   * 3. If verified, attach the payload to the request object
   */
  // const token = req.headers.authorization.split(" ")[1];
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader && authorizationHeader.trim() !== '' ? authorizationHeader.split(' ')[1] : "";
  logger.debug({ token: token });
  try {
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the payload to the request object 
    req.user_id = decodedToken.user_id;

    next();

  } catch (err) {
    logger.error(`Token Verification Failed: ${err}`);
    return res.status(401).json(createErrorResponse(401, `Unauthorized request!!`));
  }
}
