const config = require("../config");

function createUsersRoutes(app, passport, basePath, services) {

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
    services.users.deleteUser(id);
    res.json({ deleted: id });
  })
}

module.exports.createUsersRoutes = createUsersRoutes;