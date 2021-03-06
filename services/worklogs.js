const config = require("../config");
const envelope = require("../utils/envelope");
const validation = require("../validation/worklogs");
const sql = require("mssql");

async function getWorkLogs(res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .query('SELECT * FROM WorkLogs');

    let statusCode = 200;
    let message = 'WorkLogs found';
    if (result.rowsAffected[0] === 0) {
      statusCode = 404;
      res.status(statusCode);
      message = 'No workLog found';
      res.send(envelope.error(statusCode, message));
    } else {
      res.send(envelope.success(statusCode, result.recordset, message));
    }
  } catch (err) {
    // ... error checks
    console.log(err);
    let statusCode = 500;
    res.status(statusCode);
    res.send(envelope.error(statusCode, err.message));
  }
}

module.exports.getWorkLogs = getWorkLogs;

async function getWorkLog(id, res) {
  if (isNaN(id)) {
    let message = id + ' is NOT a number';
    let statusCode = 400;
    res.status(statusCode);
    return res.send(envelope.error(statusCode, message));
  }

  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM WorkLogs WHERE id = @id');

    let statusCode = 200;
    let message = 'WorkLog found';
    if (result.rowsAffected[0] === 0) {
      statusCode = 404;
      res.status(statusCode);
      message = 'WorkLog not found';
      res.send(envelope.error(statusCode, message));
    } else {
      res.send(envelope.success(statusCode, result.recordset, message));
    }
  } catch (err) {
    // ... error checks
    console.log(err);
    let statusCode = 500;
    res.status(statusCode);
    res.send(envelope.error(statusCode, err.message));
  }
}

module.exports.getWorkLog = getWorkLog;

async function addWorkLog(body, res) {

  const validated = validation.validateAddOrUpdateWorkLog(body, res);
  if (validated.isError === true) {
    res.status(validated.statusCode);
    return res.send(envelope.error(validated.statusCode, validated.message));
  }

  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('userId', sql.Int, body.userId)
      .input('taskId', sql.Int, body.taskId)
      .input('reportedHours', sql.Int, body.reportedHours)
      .output('@newRecordId', sql.Int)
      .query(`DECLARE @newRecordId INT
        INSERT INTO WorkLogs (userId, taskId, reportedHours) 
        VALUES (@userId, @taskId, @reportedHours)
        SET @newRecordId = @@IDENTITY
        SELECT @newRecordId AS N'newRecordId'`);

    let statusCode = 201;
    res.status(statusCode);
    res.send(envelope.success(statusCode, result.recordset, 'WorkLog created'));
  } catch (err) {
    // ... error checks
    console.log(err);
    let statusCode = 500;
    res.status(statusCode);
    res.send(envelope.error(statusCode, err.message));
  }
}

module.exports.addWorkLog = addWorkLog;

async function updateWorkLog(id, body, res) {
  if (isNaN(id)) {
    let message = id + ' is NOT a number';
    let statusCode = 400;
    res.status(statusCode);
    return res.send(envelope.error(statusCode, message));
  }

  const validated = validation.validateAddOrUpdateWorkLog(body, res);
  if (validated.isError === true) {
    res.status(validated.statusCode);
    return res.send(envelope.error(validated.statusCode, validated.message));
  }

  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('userId', sql.Int, body.userId)
      .input('taskId', sql.Int, body.taskId)
      .input('reportedHours', sql.Int, body.reportedHours)
      .input('id', sql.Int, id)
      .query('UPDATE WorkLogs SET userId = @userId, taskId = @taskId, reportedHours = @reportedHours WHERE id = @id');

    let statusCode = 200;
    let message = 'WorkLog updated';
    if (result.rowsAffected[0] === 0) {
      statusCode = 404;
      res.status(statusCode);
      message = 'WorkLog to update not found';
      res.send(envelope.error(statusCode, message));
    } else {
      // TODO result currently empty. Add a proper result.
      res.send(envelope.success(statusCode, result.recordset, message));
    }
  } catch (err) {
    // ... error checks
    console.log(err);
    let statusCode = 500;
    res.status(statusCode);
    res.send(envelope.error(statusCode, err.message));
  }
}

module.exports.updateWorkLog = updateWorkLog;

async function deleteWorkLog(id, res) {
  if (isNaN(id)) {
    let message = id + ' is NOT a number';
    let statusCode = 400;
    res.status(statusCode);
    return res.send(envelope.error(statusCode, message));
  }

  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM WorkLogs WHERE id = @id');

    let statusCode = 200;
    let message = 'WorkLog deleted';
    if (result.rowsAffected[0] === 0) {
      statusCode = 404;
      res.status(statusCode);
      message = 'WorkLog to delete not found';
      res.send(envelope.error(statusCode, message));
    } else {
      res.send(envelope.success(statusCode, null, message));
    }
  } catch (err) {
    // ... error checks
    console.log(err);
    let statusCode = 500;
    res.status(statusCode);
    res.send(envelope.error(statusCode, err.message));
  }
}

module.exports.deleteWorkLog = deleteWorkLog;
