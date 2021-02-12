//require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
Strategy = require('passport-http-bearer').Strategy;
const db = require('./db');
const services = require('./services');

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

const basePath = '/v1/';

app.use(passport.initialize());

passport.use(new Strategy((token, done) => {
    db.users.findByToken(token, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
    });
}));

app.get(basePath + 'users', passport.authenticate('bearer', { session: false }), (req, res) => {
    services.users.getUsers(res);
})

app.get(basePath + 'users/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
    const { id } = req.params;
    services.users.getUser(id, res);
})

app.post(basePath + 'users', passport.authenticate('bearer', { session: false }), (req, res) => {
    services.users.addUser(req.body, res);
})

app.put(basePath + 'users/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
    const { id } = req.params;
    services.users.updateUser(id, req.body);
    res.json(req.body);
})

app.delete(basePath + 'users/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
    const { id } = req.params;
    services.users.deleteUser(id);
    res.json({ deleted: id });
})

// authenticate agaist the token from app file
app.get(basePath + 'authenticate', passport.authenticate('bearer', { session: false }), (req, res) => {
        res.json(req.user);
    })

// use the token after login
app.post(basePath + 'posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                authData
            })
        }
    })
})

// get the token
app.post(basePath + 'login', (req, res) => {
    // Mock user
    const user = {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com'
    }

    jwt.sign({ user }, 'secretkey', { expiresIn: '30s' }, (err, token) => {
        res.json({
            token
        })
    })
})

// Format of token
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

app.listen(port, () => console.log(`Server started on port ${port}`));
