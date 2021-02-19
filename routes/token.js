const config = require("../config");
const jwt = require('jsonwebtoken');

function createTokenRoutes(app, passport, basePath, services) {

  // login to get the token
  app.post(basePath + 'login', async (req, res) => {
      const result = await services.token.checkUser(req.body, res);

      const user = {
        username: req.body.username,
      }

      jwt.sign({ user }, config.secretKey, { expiresIn: '30s', issuer: 'WorkLogsAPI' }, (err, token) => {
        res.json({
          token,
          result,
        })
      })
  })
}

module.exports.createTokenRoutes = createTokenRoutes;
