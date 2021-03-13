'use strict';
const config = require("../config");
const typeChecker = require("../utils/typeChecker");
const regex = require("../utils/regex");

module.exports = {

	validateAddUser: (body, res) => {
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
		} else if (!body.firstName) {
			let isError = true;
			let statusCode = 400;
			let message = 'no firstName supplied';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else if (body.firstName.length > 80) {
			let isError = true;
			let statusCode = 400;
			let message = 'firstName cannot have more than 80 characters';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else if (!body.lastName) {
			let isError = true;
			let statusCode = 400;
			let message = 'no lastName supplied';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else if (body.lastName.length > 80) {
			let isError = true;
			let statusCode = 400;
			let message = 'lastName cannot have more than 80 characters';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else if (!typeChecker.isBoolean(body.active)) {
			let isError = true;
			let statusCode = 400;
			let message = 'no field named [active] of boolean type supplied';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else if (body.comment && body.comment.length > 80) {
			let isError = true;
			let statusCode = 400;
			let message = 'comment field cannot have more than 80 characters';
			res.status(statusCode);
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
			return { isError, statusCode, message }
		} else if (!body.firstName) {
			let isError = true;
			let statusCode = 400;
			let message = 'no firstName supplied';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else if (!body.lastName) {
			let isError = true;
			let statusCode = 400;
			let message = 'no lastName supplied';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else if (!typeChecker.isBoolean(body.active)) {
			let isError = true;
			let statusCode = 400;
			let message = 'no field named [active] of boolean type supplied';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else {
			let isError = false;
			return { isError }
		}
	},
};
