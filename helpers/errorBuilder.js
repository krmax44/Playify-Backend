const token = require('../helpers/getToken');

const errors = {
	invalidId: {
		msg: 'Invalid ID.'
	},
	invalidPage: {
		msg: 'Invalid page.'
	}
};

module.exports = {
	build: errorObject => {
		return {
			error: true,
			errorMsg: errorObject.msg
		};
	},
	handle: error => {
		if (error.response) {
			if (error.response.status === 401) {
				token.renew();
			}
		}
	},
	errors
};