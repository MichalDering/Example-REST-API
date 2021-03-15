'use strict';

module.exports = {

	validateAddOrUpdateWorkLog: (body, res) => {
		if (!body.userId || isNaN(body.userId)) {
			let isError = true;
			let statusCode = 400;
			let message = 'no userId supplied or not as a number';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else if (!body.taskId || isNaN(body.taskId)) {
			let isError = true;
			let statusCode = 400;
			let message = 'no taskId supplied or not as a number';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else if (!body.reportedHours || isNaN(body.reportedHours)) {
			let isError = true;
			let statusCode = 400;
			let message = 'no reportedHours supplied or not as a number';
			res.status(statusCode);
			return { isError, statusCode, message }
		} else {
			let isError = false;
			return { isError }
		}
	},
};
