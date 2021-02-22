const config = require("../config");
const sql = require("mssql");

async function getUsers(res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .query('SELECT * FROM Users');

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

module.exports.getUsers = getUsers;

async function getUser(id, res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Users WHERE id = @id');

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

module.exports.getUser = getUser;

async function addUser(body, res) {
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
    const output = {
      statusCode: result.recordset[0].statusCode,
      responseMessage: result.recordset[0].responseMessage,
    }
    if (output.statusCode === 0) {
      res.status(201);
    } else {
      res.status(409);
      output.responseMessage = 'Could not add a user. Database error. Possible conflict.';
    }
    res.send(output);
  } catch (err) {
    // ... error checks
    console.log(err);
    res.status(500);
    res.send(err);
  }
}

module.exports.addUser = addUser;

async function updateUser(id, body, res) {
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

    const output = {
      statusCode: result.recordset[0].statusCode,
      responseMessage: result.recordset[0].responseMessage,
    }
    if (output.statusCode === 0) {
      res.status(200);
      output.record = {
        userName: result.recordset[0].userName,
        firstName: result.recordset[0].firstName,
        lastName: result.recordset[0].lastName,
        active: result.recordset[0].active,
        comment: result.recordset[0].comment,
      }
    } else if (output.statusCode === 1) {
      res.status(404);
    } else {
      res.status(400);
      output.responseMessage = 'Could not update a user. Database error.';
    }
    res.send(output);
  } catch (err) {
    // ... error checks
    console.log(err);
    res.status(500);
    res.send(err);
  }
}

module.exports.updateUser = updateUser;

async function deleteUser(id, res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Users WHERE id = @id');
      // TODO delete user or deactivate user: here a stored procedure would be more suggested

    const output = {
      statusCode: 0,
      responseMessage: 'User successfully deleted, id: ' + id,
    }
    if (result.rowsAffected[0] === 0) {
      res.status(404);
      output.statusCode = 1;
      output.responseMessage = 'User does not exist, id: ' + id;
    }
    res.send(output);
  } catch (err) {
    // ... error checks
    console.log(err);
    res.status(500);
    res.send(err);
  }
}

module.exports.deleteUser = deleteUser;
