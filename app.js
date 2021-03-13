const config = require("./config");
const express = require('express');
const passport = require('passport');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
app.use(express.json());

const port = config.port || 5000;
const basePath = '/v1/';

routes.token.createTokenRoutes(app, basePath);
routes.users.createUsersRoutes(app, passport, basePath);
routes.tasks.createTasksRoutes(app, passport, basePath);
routes.worklogs.createWorkLogsRoutes(app, passport, basePath);

app.use('/api-docs', swaggerUi.serve,   swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`Server started on port ${port}`));

routes.token.configurePassport(app, passport);
