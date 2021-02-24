const config = require("../config");

function createTasksRoutes(app, passport, basePath, services) {

  app.get(basePath + 'tasks', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    services.tasks.getTasks(res);
  })

  app.get(basePath + 'tasks/:id', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    const { id } = req.params;
    services.tasks.getTask(id, res);
  })

  app.post(basePath + 'tasks', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    services.tasks.addTask(req.body, res);
  })

  app.put(basePath + 'tasks/:id', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    const { id } = req.params;
    services.tasks.updateTask(id, req.body, res);
  })

  app.delete(basePath + 'tasks/:id', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    const { id } = req.params;
    services.tasks.deleteTask(id, res);
  })
}

module.exports.createTasksRoutes = createTasksRoutes;
