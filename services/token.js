const config = require("../config");
const sql = require("mssql");

async function checkUser(body, res) {
  try {
    let pool = await sql.connect(config.sqlConfig);
    let result = await pool.request()
      .input('userName', sql.NVarChar, body.userName)
      .input('password', sql.NVarChar, body.password)
      .output('@statusCode', sql.Int)
      .output('@responseMessage', sql.NVarChar(250))
      .query(`DECLARE @statusCode INT
              DECLARE @responseMessage NVARCHAR(250)
              EXEC uspLogin
                  @pUserName = @userName,
                  @pPassword = @password,
                  @statusCode = @statusCode OUTPUT,
                  @responseMessage = @responseMessage OUTPUT
              SELECT @statusCode AS N'statusCode', @responseMessage AS N'responseMessage'`);

    return result.recordset;
  } catch (err) {
    // ... error checks
    console.log(err);
    res.status(500);
    return err;
  }
}

module.exports.checkUser = checkUser;
