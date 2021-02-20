const config = require("../config");
const jwt = require('jsonwebtoken');

function createTokenRoutes(app, passport, basePath, services) {

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
