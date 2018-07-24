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
	errors
};