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
        return done(err);
      }
      if (!authData) {
        return done(null, false);
      }
      if (authData.iss !== config.tokenIssuer) {
        return done(Error('Wrong token issuer'));
      }
      return done(null, authData);
    })
  }));

  // Middleware error handler to output json response instead of html
  function handleError(err, req, res, next) {
    const output = {
      error: {
        name: err.name,
        message: err.message,
        text: err.toString(),
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
