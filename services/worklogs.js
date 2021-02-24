const config = require("../config");
const envelope = require("../utils/envelope");
const sql = require("mssql");

async function getWorkLogs(res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .query('SELECT * FROM WorkLogs');

    if (result.rowsAffected[0] === 0) {
      res.status(404);
    }
    res.send(envelope.success(result.recordset));
  } catch (err) {
    // ... error checks
    console.log(err);
    res.status(500);
    res.send(envelope.error(err));
  }
}

module.exports.getWorkLogs = getWorkLogs;

async function getWorkLog(id, res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM WorkLogs WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
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

module.exports.getWorkLog = getWorkLog;

async function addWorkLog(body, res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('userId', sql.Int, body.userId)
      .input('taskId', sql.Int, body.taskId)
      .input('reportedHours', sql.Int, body.reportedHours)
      .query('INSERT INTO WorkLogs (userId, taskId, reportedHours) VALUES (@userId, @taskId, @reportedHours)');

    res.status(201);
    res.send(result.recordset);
  } catch (err) {
    // ... error checks
    console.log(err);
    res.status(500);
    res.send(err);
  }
}

module.exports.addWorkLog = addWorkLog;

async function updateWorkLog(id, body, res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('userId', sql.Int, body.userId)
      .input('taskId', sql.Int, body.taskId)
      .input('reportedHours', sql.Int, body.reportedHours)
      .input('id', sql.Int, id)
      .query('UPDATE WorkLogs SET userId = @userId, taskId = @taskId, reportedHours = @reportedHours WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      res.status(404);
    }
    // TODO result currently empty. Add a proper result.
    res.send(result.recordset);
  } catch (err) {
    // ... error checks
    console.log(err);
    res.status(500);
    res.send(err);
  }
}

module.exports.updateWorkLog = updateWorkLog;

async function deleteWorkLog(id, res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM WorkLogs WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      res.status(404);
      res.send({
        message: 'WorkLogs to delete not found, id: ' + id,
        code: 404
      });
    } else {
      res.send({ message: 'Deleted workLog with id: ' + id });
    }
  } catch (err) {
    // ... error checks
    console.log(err);
    res.status(500);
    res.send(err);
  }
}

module.exports.deleteWorkLog = deleteWorkLog;
