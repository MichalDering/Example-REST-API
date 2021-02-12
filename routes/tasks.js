function createTasksRoutes(app, passport, basePath, services) {

    app.get(basePath + 'tasks', passport.authenticate('bearer', { session: false }), (req, res) => {
      services.tasks.getTasks(res);
    })
  
    app.get(basePath + 'tasks/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
      const { id } = req.params;
      services.tasks.getTask(id, res);
    })
  
    app.post(basePath + 'tasks', passport.authenticate('bearer', { session: false }), (req, res) => {
      services.tasks.addTask(req.body, res);
    })
  
    app.put(basePath + 'tasks/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
      const { id } = req.params;
      services.tasks.updateTask(id, req.body);
      res.json(req.body);
    })
  
    app.delete(basePath + 'tasks/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
      const { id } = req.params;
      services.tasks.deleteTask(id);
      res.json({ deleted: id });
    })
  }
  
  module.exports.createTasksRoutes = createTasksRoutes;