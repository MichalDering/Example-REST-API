const config = require("../config");
const envelope = require("../utils/envelope");
const validation = require("../validation/users");
const sql = require("mssql");

async function getUsers(res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .query('SELECT * FROM Users');

    let statusCode = 200;
    let message = 'Users found';
    if (result.rowsAffected[0] === 0) {
      statusCode = 404;
      res.status(statusCode);
      message = 'No user found';
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

module.exports.getUsers = getUsers;

async function getUser(id, res) {
  if (isNaN(id)) {
    let message = id + ' is NOT a number';
    console.log(message);
    let statusCode = 400;
    res.status(statusCode);
    return res.send(envelope.error(statusCode, message));
  }

  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Users WHERE id = @id');

    let statusCode = 200;
    let message = 'User found';
    if (result.rowsAffected[0] === 0) {
      statusCode = 404;
      res.status(statusCode);
      message = 'No user found';
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

module.exports.getUser = getUser;

async function addUser(body, res) {

  const validated = validation.validateAddUser(body, res);
  if (validated.isError === true) {
    res.status(validated.statusCode);
    return res.send(envelope.error(validated.statusCode, validated.message));
  }

  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('userName', sql.NVarChar, body.userName)
      .input('password', sql.NVarChar, body.password)
      .input('firstName', sql.NVarChar, body.firstName)
      .input('lastName', sql.NVarChar, body.lastName)
      .input('active', sql.Bit, body.active)
      .input('comment', sql.NVarChar, body.comment)
      .output('@statusCode', sql.Int)
      .output('@responseMessage', sql.NVarChar(250))
      .query(`DECLARE @statusCode INT
              DECLARE @responseMessage NVARCHAR(250)

              EXEC uspAddUser
                  @pUserName = @userName,
                  @pPassword = @password,
                  @pFirstName = @firstName,
                  @pLastName = @lastName,
                  @pActive = @active,
                  @pComment = @comment,
                  @statusCode = @statusCode OUTPUT,
                  @responseMessage = @responseMessage OUTPUT

              SELECT @statusCode AS N'statusCode', @responseMessage AS N'responseMessage'`);

    // TODO in case of success return also a whole new object
    let statusCode = result.recordset[0].statusCode;
    let message = result.recordset[0].responseMessage;
    if (statusCode === 0) {
      res.status(201);
      res.send(envelope.success(201, result.recordset, message))
    } else {
      res.status(409);
      message = 'Could not add a user. Database error. Possible conflict.';
      res.send(envelope.error(409, message));
    }
  } catch (err) {
    // ... error checks
    console.log(err);
    let statusCode = 500;
    res.status(statusCode);
    res.send(envelope.error(statusCode, err.message));
  }
}

module.exports.addUser = addUser;

async function updateUser(id, body, res) {
  if (isNaN(id)) {
    let message = id + ' is NOT a number';
    console.log(message);
    let statusCode = 400;
    res.status(statusCode);
    return res.send(envelope.error(statusCode, message));
  }

  const validated = validation.validateUpdateUser(body, res);
  if (validated.isError === true) {
    res.status(validated.statusCode);
    return res.send(envelope.error(validated.statusCode, validated.message));
  }

  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .input('password', sql.NVarChar, body.password)
      .input('firstName', sql.NVarChar, body.firstName)
      .input('lastName', sql.NVarChar, body.lastName)
      .input('active', sql.Bit, body.active)
      .input('comment', sql.NVarChar, body.comment)
      .output('@statusCode', sql.Int)
      .output('@responseMessage', sql.NVarChar(250))
      .query(`DECLARE @statusCode INT
              DECLARE @responseMessage NVARCHAR(250)
              DECLARE @newUserName NVARCHAR(50)
              DECLARE @newFirstName NVARCHAR(80)
              DECLARE @newLastName NVARCHAR(80)
              DECLARE @newActive BIT
              DECLARE @newComment NVARCHAR(80)
              
              EXEC dbo.uspUpdateUser
                  @pId = @id,
                  @pPassword = @password,
                  @pFirstName = @firstName,
                  @pLastName = @lastName,
                  @pActive = @active,
                  @pComment = @comment,
                  @statusCode = @statusCode OUTPUT,
                  @responseMessage = @responseMessage OUTPUT,
                  @newUserName = @newUserName OUTPUT,
                  @newFirstName = @newFirstName OUTPUT,
                  @newLastName = @newLastName OUTPUT,
                  @newActive = @newActive OUTPUT,
                  @newComment = @newComment OUTPUT

              SELECT @statusCode AS N'statusCode', @responseMessage AS N'responseMessage', @newUserName AS N'userName', @newFirstName AS N'firstName', @newLastName AS N'lastName', @newActive AS N'active', @newComment AS N'comment'`);

    let statusCode = result.recordset[0].statusCode;
    let message = result.recordset[0].responseMessage;

    if (statusCode === 0) {
      res.status(200);
      record = {
        userName: result.recordset[0].userName,
        firstName: result.recordset[0].firstName,
        lastName: result.recordset[0].lastName,
        active: result.recordset[0].active,
        comment: result.recordset[0].comment,
      }
      res.send(envelope.success(200, record, message));
    } else if (statusCode === 1) {
      res.status(404);
      res.send(envelope.error(404, message, statusCode));
    } else if (statusCode === 2) {
      res.status(500);
      res.send(envelope.error(500, message, statusCode));
    } else {
      res.status(400);
      message = 'Could not update a user. Database error.';
      res.send(envelope.error(400, message));
    }
  } catch (err) {
    // ... error checks
    console.log(err);
    let statusCode = 500;
    res.status(statusCode);
    res.send(envelope.error(statusCode, err.message));
  }
}

module.exports.updateUser = updateUser;

async function deleteUser(id, res) {
  if (isNaN(id)) {
    let message = id + ' is NOT a number';
    console.log(message);
    let statusCode = 400;
    res.status(statusCode);
    return res.send(envelope.error(statusCode, message));
  }
  
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Users WHERE id = @id');
    // TODO delete user or deactivate user: here a stored procedure would be more suggested

    if (result.rowsAffected[0] === 0) {
      res.send(envelope.error(404, 'User does not exist', 1));
    } else {
      res.send(envelope.success(200, null, 'User successfully deleted'));
    }
  } catch (err) {
    // ... error checks
    console.log(err);
    let statusCode = 500;
    res.status(statusCode);
    res.send(envelope.error(statusCode, err.message));
  }
}

module.exports.deleteUser = deleteUser;
