'use strict';
const config = require("../config");
const regex = require("../utils/regex");

module.exports = {

	validateUserLoginInput: (body, res) => {
		if (!body.userName) {
			let isError = true;
			let statusCode = 400;
			let message = 'no userName supplied';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else if (body.userName.length < config.userNameLenghtMin || body.userName.length > config.userNameLenghtMax) {
			let isError = true;
			let statusCode = 400;
			let message = 'userName must have from ' + config.userNameLenghtMin + ' to ' + config.userNameLenghtMax + ' characters';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else if (!regex.userNameRegex.test(body.userName)) {
			let isError = true;
			let statusCode = 400;
			let message = 'userName must contain letters or numbers or both';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else if (!body.password) {
			let isError = true;
			let statusCode = 400;
			let message = 'no password supplied';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else if (body.password.length < config.userPasswordLenghtMin || body.password.length > config.userPasswordLenghtMax) {
			let isError = true;
			let statusCode = 400;
			let message = 'password must have from ' + config.userPasswordLenghtMin + ' to ' + config.userPasswordLenghtMax + ' characters';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else {
			let isError = false;
			return { isError }
		}
	},
};
