const config = require("../config");
const envelope = require("../utils/envelope");
const sql = require("mssql");

async function loginUser(body, res) {
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

    // TODO return 400 if Invalid username/password supplied
    let statusCode = 200;
    return envelope.success(statusCode, null, result.recordset[0].responseMessage, result.recordset[0].statusCode);
  } catch (err) {
    // ... error checks
    console.log(err);
    let statusCode = 500;
    res.status(statusCode);
    return envelope.error(statusCode, err.message);
  }
}

module.exports.loginUser = loginUser;
