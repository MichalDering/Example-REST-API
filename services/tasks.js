const config = require("../config");
const envelope = require("../utils/envelope");
const validation = require("../validation/tasks");
const sql = require("mssql");

async function getTasks(res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .query('SELECT * FROM Tasks');

    if (result.rowsAffected[0] === 0) {
      res.status(404);
      res.send(envelope.error(404, 'Task does not exist', 1));
    } else {
      res.send(envelope.success(200, result.recordset));
    }
  } catch (err) {
    // ... error checks
    console.log(err);
    let statusCode = 500;
    res.status(statusCode);
    res.send(envelope.error(statusCode, err.message));
  }
}

module.exports.getTasks = getTasks;

async function getTask(id, res) {
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
      .query('SELECT * FROM Tasks WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      res.status(404);
      res.send(envelope.error(404, 'Task does not exist', 1));
    } else {
      res.send(envelope.success(200, result.recordset));
    }
  } catch (err) {
    // ... error checks
    console.log(err);
    let statusCode = 500;
    res.status(statusCode);
    res.send(envelope.error(statusCode, err.message));
  }
}

module.exports.getTask = getTask;

async function addTask(body, res) {

  const validated = validation.validateAddOrUpdateTask(body, res);
  if (validated.isError === true) {
    res.status(validated.statusCode);
    return res.send(envelope.error(validated.statusCode, validated.message));
  }
  
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('userId', sql.Int, body.userId)
      .input('summary', sql.NVarChar, body.summary)
      .input('status', sql.NVarChar, body.status)
      .query(`DECLARE @newRecordId INT
        INSERT INTO Tasks (userId, summary, status) 
        VALUES (@userId, @summary, @status)
        SET @newRecordId = @@IDENTITY
        SELECT @newRecordId AS N'newRecordId'`);

    res.status(201);
    res.send(envelope.success(201, result.recordset, 'Task created'));
  } catch (err) {
    // ... error checks
    console.log(err);
    let statusCode = 500;
    res.status(statusCode);
    res.send(envelope.error(statusCode, err.message));
  }
}

module.exports.addTask = addTask;

async function updateTask(id, body, res) {
  if (isNaN(id)) {
    let message = id + ' is NOT a number';
    let statusCode = 400;
    res.status(statusCode);
    return res.send(envelope.error(statusCode, message));
  }

  const validated = validation.validateAddOrUpdateTask(body, res);
  if (validated.isError === true) {
    res.status(validated.statusCode);
    return res.send(envelope.error(validated.statusCode, validated.message));
  }

  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('userId', sql.Int, body.userId)
      .input('summary', sql.NVarChar, body.summary)
      .input('status', sql.NVarChar, body.status)
      .input('id', sql.Int, id)
      .query('UPDATE Tasks SET userId = @userId, summary = @summary, status = @status WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      res.status(404);
      res.send(envelope.error(404, 'Task does not exist', 1));
    } else {
      // TODO result currently empty. Add a proper result.
      res.send(envelope.success(200, result.recordset));
    }
  } catch (err) {
    // ... error checks
    console.log(err);
    let statusCode = 500;
    res.status(statusCode);
    res.send(envelope.error(statusCode, err.message));
  }
}

module.exports.updateTask = updateTask;

async function deleteTask(id, res) {
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
      .query('DELETE FROM Tasks WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      res.status(404);
      res.send(envelope.error(404, 'Task not found'));
    } else {
      res.send(envelope.success(200, null, 'Task deleted'));
    }
  } catch (err) {
    // ... error checks
    console.log(err);
    let statusCode = 500;
    res.status(statusCode);
    res.send(envelope.error(statusCode, err.message));
  }
}

module.exports.deleteTask = deleteTask;
