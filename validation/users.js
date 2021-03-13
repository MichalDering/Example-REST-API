'use strict';
const config = require("../config");
const typeChecker = require("../utils/typeChecker");

module.exports = {

	validateAddUser: (body, res) => {
		console.log('body.password ' + body.password);

		if (!body.userName) {
			let isError = true;
			let statusCode = 400;
			let message = 'no userName supplied';
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		} else if (body.userName.length < config.userNameLenghtMin || body.userName.length > config.userNameLenghtMax) {
			let isError = true;
			let statusCode = 400;
			let message = 'userName must have from ' + config.userNameLenghtMin + ' to ' + config.userNameLenghtMax + ' characters';
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		} else if (!body.password) {
			let isError = true;
			let statusCode = 400;
			let message = 'no password supplied';
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		} else if (body.password.length < config.userPasswordLenghtMin || body.password.length > config.userPasswordLenghtMax) {
			let isError = true;
			let statusCode = 400;
			let message = 'password must have from ' + config.userPasswordLenghtMin + ' to ' + config.userPasswordLenghtMax + ' characters';
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		} else if (!body.firstName) {
			let isError = true;
			let statusCode = 400;
			let message = 'no firstName supplied';
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		} else if (!body.lastName) {
			let isError = true;
			let statusCode = 400;
			let message = 'no lastName supplied';
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		} else if (!typeChecker.isBoolean(body.active)) {
			let isError = true;
			let statusCode = 400;
			let message = 'no field named [active] of boolean type supplied';
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		} else {
			let isError = false;
			return { isError }
		}
	},

	validateUpdateUser: (body, res) => {
		if (!body.password) {
			let isError = true;
			let statusCode = 400;
			let message = 'no password supplied';
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		} else if (!body.firstName) {
			let isError = true;
			let statusCode = 400;
			let message = 'no firstName supplied';
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		} else if (!body.lastName) {
			let isError = true;
			let statusCode = 400;
			let message = 'no lastName supplied';
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		} else if (!typeChecker.isBoolean(body.active)) {
			let isError = true;
			let statusCode = 400;
			let message = 'no field named [active] of boolean type supplied';
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		} else {
			let isError = false;
			return { isError }
		}
	},
};
