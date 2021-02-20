const config = require("./config");
const express = require('express');
const passport = require('passport');
const routes = require('./routes');
const services = require('./services');

const app = express();
app.use(express.json());

const port = config.port || 5000;
const basePath = '/v1/';

routes.token.createTokenRoutes(app, basePath, services);
routes.users.createUsersRoutes(app, passport, basePath, services);
routes.tasks.createTasksRoutes(app, passport, basePath, services);
routes.worklogs.createWorkLogsRoutes(app, passport, basePath, services);

app.listen(port, () => console.log(`Server started on port ${port}`));

routes.token.configurePassport(app, passport);
