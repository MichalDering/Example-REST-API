const config = require("./config");
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
Strategy = require('passport-http-bearer').Strategy;
const routes = require('./routes');
const services = require('./services');

const app = express();
app.use(express.json());
const port = config.port || 5000;

const basePath = '/v1/';

app.use(passport.initialize());

passport.use(new Strategy((token, done) => {
    jwt.verify(token, config.secretKey, (err, authData) => {
        if (err) {
            return done(err);
        }
        if (!authData) {
            return done(null, false);
        }
        if (authData.iss !== config.tokenIssuer) {
            console.log('Wrong token issuer')
            return done(Error('Wrong token issuer'));
        }
        return done(null, authData);
    })
}));

routes.token.createTokenRoutes(app, passport, basePath, services);
routes.users.createUsersRoutes(app, passport, basePath, services);
routes.tasks.createTasksRoutes(app, passport, basePath, services);
routes.worklogs.createWorkLogsRoutes(app, passport, basePath, services);

app.listen(port, () => console.log(`Server started on port ${port}`));

// Middleware error handler to output json response instead of html
function handleError(err, req, res, next) {
    const output = {
        error: {
            name: err.name,
            message: err.message,
            text: err.toString(),
        }
    };
    const statusCode = err.status || 500;
    res.status(statusCode).json(output);
}

// Use middleware error handler
app.use([
    handleError
]);
