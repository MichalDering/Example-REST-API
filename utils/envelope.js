'use strict';

module.exports = {

	/**
	 * Wraps response data in an envelope in case of success.
	 *
	 * @param {Number} statusCode
	 * @param {Array} data
	 * @param {String} message
	 * @param {Number} errorCode
	 * @return {Object}
	 */
	success: (statusCode, data, message, errorCode) => {

		if (statusCode == null) {
			statusCode = undefined;
		}
		if (data == null) {
			data = [];
		}
		if (message == null) {
			message = '';
		}
		if (errorCode == null) {
			errorCode = 0;
		}

		return {
			'status': 'Success',
			'message': message,
			'statusCode': statusCode,
			'errorCode': errorCode,
			'result': data,
		};
	},

	/**
	 * Wraps response data in an envelope in case of error.
	 *
	 * @param {Number} statusCode
	 * @param {String} message
	 * @param {Number} errorCode
	 * @return {Object}
	 */
	error: (statusCode, message, errorCode) => {

		if (statusCode == null) {
			statusCode = undefined;
		}
		if (message == null) {
			message = '';
		}
		if (errorCode == null) {
			errorCode = -1;
		}

		return {
			'status': 'Error',
			'message': message,
			'statusCode': statusCode,
			'errorCode': errorCode,
			'result': [],
		};
	},
};
