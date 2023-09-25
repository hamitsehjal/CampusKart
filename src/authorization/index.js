const passportJWT = require('passport-jwt');
const logger = require('../logger');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

var options = {};
options.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme('jwt');
options.secretOrKey = process.env.JWT_SECRET;

const strategy = new JWTStrategy(options, function (jwt_payload, done) {
  logger.info({ jwt_payload }, `Decoded JWT Token`);
  if (jwt_payload) {
    done(null, jwt_payload);
  } else {
    done(null, false);
  }
})

module.exports = strategy;
