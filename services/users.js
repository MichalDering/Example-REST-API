const config = require("../config");
const sql = require("mssql");

async function getUsers(res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .query('SELECT * FROM Users');

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

module.exports.getUsers = getUsers;

async function getUser(id, res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Users WHERE id = @id');

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

              SELECT @statusCode AS N'@statusCode', @responseMessage AS N'@responseMessage'`);

    res.status(201);
    res.send(result.recordset);
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
              
              EXEC dbo.uspUpdateUser
                  @pId = @id,
                  @pPassword = @password,
                  @pFirstName = @firstName,
                  @pLastName = @lastName,
                  @pActive = @active,
                  @pComment = @comment,
                  @statusCode = @statusCode OUTPUT,
                  @responseMessage = @responseMessage OUTPUT

              SELECT @statusCode AS N'@statusCode', @responseMessage AS N'@responseMessage'`);

    if (result.recordset.length === 0) {
      res.status(404);
    }
    res.json(result.recordset);
  } catch (err) {
    // ... error checks
    console.log(err);
    res.status(500);
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

module.exports.deleteUser = deleteUser;
