//require('dotenv').config()
const express = require('express');
const sql = require("mssql");
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

// config for your database
var config = {
    user: 'developer',
    password: 'developer',
    server: 'localhost',
    database: 'WorkLogs',
    options: {
        enableArithAbort: true
    }
};

async function getUsers(res) {
    try {
        let pool = await sql.connect(config);
        let result1 = await pool.request()
            .query('SELECT * FROM Users');

        console.dir(result1.recordset);
        res.send(result1.recordset);
    } catch (err) {
        // ... error checks
        console.log(err);
        res.send(err);
    }
}

async function getUser(id, res) {
    try {
        let pool = await sql.connect(config);
        let result1 = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Users WHERE id = @id');

            res.send(result1.recordset);
    } catch (err) {
        // ... error checks
        console.log(err);
        res.send(err);
    }
}

async function addUser(body, res) {
    try {
        let pool = await sql.connect(config);
        let result1 = await pool.request()
            .input('userName', sql.VarChar, body.userName)
            .input('firstName', sql.VarChar, body.firstName)
            .input('lastName', sql.VarChar, body.lastName)
            .input('active', sql.Bit, body.active)
            .query('INSERT INTO Users (userName, firstName, lastName, active) VALUES (@userName, @firstName, @lastName, @active)');

        res.status(201);
        res.send(result1.recordset);
    } catch (err) {
        // ... error checks
        console.log(err);
        res.send(err);
    }
}

async function updateUser(id, body) {
    try {
        let pool = await sql.connect(config);
        let result1 = await pool.request()
            .input('userName', sql.VarChar, body.userName)
            .input('firstName', sql.VarChar, body.firstName)
            .input('lastName', sql.VarChar, body.lastName)
            .input('active', sql.Bit, body.active)
            .input('id', sql.Int, id)
            .query('UPDATE Users SET userName = @userName, firstName = @firstName, lastName = @lastName, active = @active WHERE id = @id');
    } catch (err) {
        // ... error checks
        console.log(err);
        res.send(err);
    }
}

async function deleteUser(id) {
    try {
        let pool = await sql.connect(config);
        let result1 = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Users WHERE id = @id');
    } catch (err) {
        // ... error checks
        console.log(err);
        res.send(err);
    }
}

app.get(basePath + 'users', passport.authenticate('bearer', { session: false }), (req, res) => {
    getUsers(res);
})

app.get(basePath + 'users/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
    const { id } = req.params;
    getUser(id, res);
})

app.post(basePath + 'users', passport.authenticate('bearer', { session: false }), (req, res) => {
    addUser(req.body, res);
})

app.put(basePath + 'users/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
    const { id } = req.params;
    updateUser(id, req.body);
    res.json(req.body);
})

app.delete(basePath + 'users/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
    const { id } = req.params;
    deleteUser(id);
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
