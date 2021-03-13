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
    TASK_STATUSES,
    USER_NAME_LENGHT_MIN,
    USER_NAME_LENGHT_MAX,
    USER_PASSWORD_LENGHT_MIN,
    USER_PASSWORD_LENGHT_MAX,
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
    passportAuthenticateOptions: {
        session: false,
        failWithError: true
    },
    taskStatuses: TASK_STATUSES,
    userNameLenghtMin: USER_NAME_LENGHT_MIN,
    userNameLenghtMax: USER_NAME_LENGHT_MAX,
    userPasswordLenghtMin: USER_PASSWORD_LENGHT_MIN,
    userPasswordLenghtMax: USER_PASSWORD_LENGHT_MAX,
};
