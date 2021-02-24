'use strict';

module.exports = {

	/**
	 * Wraps response data in an envelope in case of success.
	 *
	 * @param {Array} data
	 * @param {String} message
	 * @return {Object}
	 */
	success: (data, message) => {

		if (data == null) {
			data = [];
		}
		if (message == null) {
			message = '';
		}

		return {
			'status': 'success',
			'errorCode': 0,
			'result': data,
			'message': message,
		};
	},

	/**
	 * Wraps response data in an envelope in case of error.
	 *
	 * @param {String} message
	 * @param {Number} errorCode
	 * @return {Object}
	 */
	error: (message, errorCode) => {

		if (message == null) {
			message = '';
		}
		if (errorCode == null) {
			errorCode = -1;
		}

		return {
			'status': 'error',
			'errorCode': errorCode,
			'result': [],
			'message': message,
		};
	},
};
