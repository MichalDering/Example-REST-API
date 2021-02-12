const config = require("../config");
const sql = require("mssql");

async function getUsers(res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .query('SELECT * FROM Users');

    console.dir(result.recordset);
    res.send(result.recordset);
  } catch (err) {
    // ... error checks
    console.log(err);
    res.send(err);
  }
}

module.exports.getUsers = getUsers;

async function getUser(id, res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Users WHERE id = @id');

    res.send(result.recordset);
  } catch (err) {
    // ... error checks
    console.log(err);
    res.send(err);
  }
}

module.exports.getUser = getUser;

async function addUser(body, res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('userName', sql.VarChar, body.userName)
      .input('firstName', sql.VarChar, body.firstName)
      .input('lastName', sql.VarChar, body.lastName)
      .input('active', sql.Bit, body.active)
      .query('INSERT INTO Users (userName, firstName, lastName, active) VALUES (@userName, @firstName, @lastName, @active)');

    res.status(201);
    res.send(result.recordset);
  } catch (err) {
    // ... error checks
    console.log(err);
    res.send(err);
  }
}

module.exports.addUser = addUser;

async function updateUser(id, body) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
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

module.exports.updateUser = updateUser;

async function deleteUser(id) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Users WHERE id = @id');
  } catch (err) {
    // ... error checks
    console.log(err);
    res.send(err);
  }
}

module.exports.deleteUser = deleteUser;
