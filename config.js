require('dotenv').config();

// capture the environment variables the application needs
const { PORT,
    HOST,
    HOST_URL,
    SQL_SERVER,
    SQL_DATABASE,
    SQL_USER,
    SQL_PASSWORD,
    SQL_ENCRYPT,
    SECRET_KEY,
    TOKEN_EXPIRES_IN,
    TOKEN_ISSUER,
} = process.env;

const sqlEncrypt = process.env.SQL_ENCRYPT === "true";

// export the configuration information
module.exports = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    sqlConfig: {
        server: SQL_SERVER,
        database: SQL_DATABASE,
        user: SQL_USER,
        password: SQL_PASSWORD,
        options: {
            encrypt: sqlEncrypt,
            enableArithAbort: true
        }
    },
    secretKey: SECRET_KEY,
    tokenExpiresIn: TOKEN_EXPIRES_IN,
    tokenIssuer: TOKEN_ISSUER,
};
