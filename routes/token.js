const config = require("../config");
const envelope = require("../utils/envelope");
const jwt = require('jsonwebtoken');
Strategy = require('passport-http-bearer').Strategy;

function createTokenRoutes(app, basePath, services) {

  // login to get the token
  app.post(basePath + 'users/login', async (req, res) => {
    const result = await services.token.loginUser(req.body, res);

    if (result.errorCode == 0) {
      jwt.sign({}, config.secretKey, { expiresIn: config.tokenExpiresIn, issuer: config.tokenIssuer }, (err, token) => {
        result.token = token;
        res.send(result)
      })
    } else {
      res.send(result)
    }
  })
}

module.exports.createTokenRoutes = createTokenRoutes;

function configurePassport(app, passport) {
  app.use(passport.initialize());

  passport.use(new Strategy((token, done) => {
    jwt.verify(token, config.secretKey, (err, authData) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          // const error = Error('Token expired');
          // error.status = 401;
          // error.info = {
          //   message: error.message,
          //   expiredAt: err.expiredAt,
          // }
          // TODO log.info(err) into a file
          return done({ statusCode: 401, message: 'Token expired' });
        } else if (err.name === 'NotBeforeError') {
          // const error = Error('Token is not active');
          // error.status = 401;
          // error.info = {
          //   message: error.message,
          //   tokenValidFrom: err.date,
          // }
          return done({ statusCode: 401, message: 'Token is not active' });
        } else if (err.name === 'JsonWebTokenError') {
          // const error = Error('Token error');
          // error.status = 401;
          // error.info = {
          //   message: error.message,
          // }
          return done({ statusCode: 401, message: 'Token error' });
        }
        // TODO log.info(err) into a file
        return done({ statusCode: 401, message: 'Other error' });
      }
      if (!authData) {
        return done(null, false);
      }
      if (authData.iss !== config.tokenIssuer) {
        // const error = Error('Wrong token issuer');
        // error.status = 401;
        // error.info = {
        //   message: error.message,
        // }
        return done({ statusCode: 401, message: 'Wrong token issuer' });
      }
      return done(null, authData);
    })
  }));

  // Middleware error handler to output json response instead of html
  function handleError(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(envelope.error(statusCode, err.message));
  }

  // Use middleware error handler
  app.use([
    handleError
  ]);
}

module.exports.configurePassport = configurePassport;
