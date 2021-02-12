function createWorkLogsRoutes(app, passport, basePath, services) {

  app.get(basePath + 'worklogs', passport.authenticate('bearer', { session: false }), (req, res) => {
    services.worklogs.getWorkLogs(res);
  })

  app.get(basePath + 'worklogs/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
    const { id } = req.params;
    services.worklogs.getWorkLog(id, res);
  })

  app.post(basePath + 'worklogs', passport.authenticate('bearer', { session: false }), (req, res) => {
    services.worklogs.addWorkLog(req.body, res);
  })

  app.put(basePath + 'worklogs/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
    const { id } = req.params;
    services.worklogs.updateWorkLog(id, req.body);
    res.json(req.body);
  })

  app.delete(basePath + 'worklogs/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
    const { id } = req.params;
    services.worklogs.deleteWorkLog(id);
    res.json({ deleted: id });
  })
}

module.exports.createWorkLogsRoutes = createWorkLogsRoutes;