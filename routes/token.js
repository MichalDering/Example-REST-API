const config = require("../config");
const jwt = require('jsonwebtoken');
Strategy = require('passport-http-bearer').Strategy;

function createTokenRoutes(app, basePath, services) {

  // login to get the token
  app.post(basePath + 'login', async (req, res) => {
    const result = await services.token.checkUser(req.body, res);

    if (result[0].statusCode == 0) {
      jwt.sign({}, config.secretKey, { expiresIn: config.tokenExpiresIn, issuer: config.tokenIssuer }, (err, token) => {
        res.json({
          result,
          token,
        })
      })
    } else {
      res.json({
        result,
      })
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
          const error = Error('Token expired');
          error.status = 401;
          error.info = {
            message: error.message,
            expiredAt: err.expiredAt,
          }
          return done(error);
        } else if (err.name === 'NotBeforeError') {
          const error = Error('Token is not active');
          error.status = 401;
          error.info = {
            message: error.message,
            tokenValidFrom: err.date,
          }
          return done(error);
        } else if (err.name === 'JsonWebTokenError') {
          const error = Error('Token error');
          error.status = 401;
          error.info = {
            message: error.message,
          }
          return done(error);
        }
        return done(err);
      }
      if (!authData) {
        return done(null, false);
      }
      if (authData.iss !== config.tokenIssuer) {
        const error = Error('Wrong token issuer');
        error.status = 401;
        error.info = {
          message: error.message,
        }
        return done(error);
      }
      return done(null, authData);
    })
  }));

  // Middleware error handler to output json response instead of html
  function handleError(err, req, res, next) {
    const output = {
      error: {
        code: err.status,
        name: err.name,
        info: err.info,
      }
    };
    const statusCode = err.status || 500;
    res.status(statusCode).json(output);
  }

  // Use middleware error handler
  app.use([
    handleError
  ]);
}

module.exports.configurePassport = configurePassport;
