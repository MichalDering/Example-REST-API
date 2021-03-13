const config = require("../config");
const services = require('../services');

function createUsersRoutes(app, passport, basePath) {

  app.get(basePath + 'users', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    services.users.getUsers(res);
  })

  app.get(basePath + 'users/:id', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    const { id } = req.params;
    services.users.getUser(id, res);
  })

  app.post(basePath + 'users', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    services.users.addUser(req.body, res);
  })

  app.put(basePath + 'users/:id', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    const { id } = req.params;
    services.users.updateUser(id, req.body, res);
  })

  app.delete(basePath + 'users/:id', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    const { id } = req.params;
    services.users.deleteUser(id, res);
  })
}

module.exports.createUsersRoutes = createUsersRoutes;