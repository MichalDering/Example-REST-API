'use strict';
const config = require("../config");

module.exports = {

	validateAddOrUpdateTask: (body, res) => {
		if (!body.userId || isNaN(body.userId)) {
			let isError = true;
			let statusCode = 400;
			let message = 'no userId supplied or not as a number';
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		} else if (!body.summary) {
			let isError = true;
			let statusCode = 400;
			let message = 'no summary supplied';
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		} else if (!body.status) {
			let isError = true;
			let statusCode = 400;
			let message = 'no status supplied';
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		} else if (!config.taskStatuses.includes(body.status)) {
			let isError = true;
			let statusCode = 400;
			let message = 'Wrong status supplied. Possible values: ' + config.taskStatuses;
			res.status(statusCode);
			console.log(message);
			return { isError, statusCode, message }
		}  else {
			let isError = false;
			return { isError }
		}
	},
};
