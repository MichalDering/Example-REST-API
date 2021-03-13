const config = require("../config");
const services = require('../services');

function createWorkLogsRoutes(app, passport, basePath) {

  app.get(basePath + 'worklogs', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    services.worklogs.getWorkLogs(res);
  })

  app.get(basePath + 'worklogs/:id', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    const { id } = req.params;
    // TODO verify input
    services.worklogs.getWorkLog(id, res);
  })

  app.post(basePath + 'worklogs', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    services.worklogs.addWorkLog(req.body, res);
  })

  app.put(basePath + 'worklogs/:id', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    const { id } = req.params;
    services.worklogs.updateWorkLog(id, req.body, res);
  })

  app.delete(basePath + 'worklogs/:id', passport.authenticate('bearer', config.passportAuthenticateOptions), (req, res) => {
    const { id } = req.params;
    services.worklogs.deleteWorkLog(id, res);
  })
}

module.exports.createWorkLogsRoutes = createWorkLogsRoutes;