const config = require("../config");
const sql = require("mssql");

async function getTasks(res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .query('SELECT * FROM Tasks');

    if (result.recordset.length === 0) {
      res.status(404);
    }
    res.send(result.recordset);
  } catch (err) {
    // ... error checks
    console.log(err);
    res.status(500);
    res.send(err);
  }
}

module.exports.getTasks = getTasks;

async function getTask(id, res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Tasks WHERE id = @id');

    if (result.recordset.length === 0) {
      res.status(404);
    }
    res.send(result.recordset);
  } catch (err) {
    // ... error checks
    console.log(err);
    res.status(500);
    res.send(err);
  }
}

module.exports.getTask = getTask;

async function addTask(body, res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('userId', sql.Int, body.userId)
      .input('summary', sql.NVarChar, body.summary)
      .input('status', sql.NVarChar, body.status)
      .query('INSERT INTO Tasks (userId, summary, status) VALUES (@userId, @summary, @status)');

    res.status(201);
    res.send(result.recordset);
  } catch (err) {
    // ... error checks
    console.log(err);
    res.status(500);
    res.send(err);
  }
}

module.exports.addTask = addTask;

async function updateTask(id, body) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('userId', sql.Int, body.userId)
      .input('summary', sql.NVarChar, body.summary)
      .input('status', sql.NVarChar, body.status)
      .input('id', sql.Int, id)
      .query('UPDATE Tasks SET userId = @userId, summary = @summary, status = @status WHERE id = @id');

    if (result.recordset.length === 0) {
      res.status(404);
    }
  } catch (err) {
    // ... error checks
    console.log(err);
    res.status(500);
    res.send(err);
  }
}

module.exports.updateTask = updateTask;

async function deleteTask(id) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Tasks WHERE id = @id');

    if (result.recordset.length === 0) {
      res.status(404);
    }
  } catch (err) {
    // ... error checks
    console.log(err);
    res.status(500);
    res.send(err);
  }
}

module.exports.deleteTask = deleteTask;
