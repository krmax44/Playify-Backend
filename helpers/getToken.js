const axios = require('axios');
const config = require('../config');
const auth = { username: config.clientId, password: config.clientSecret }; // for axios
const querystring = require('querystring');

let token = "";

// see https://developer.spotify.com/documentation/general/guides/authorization-guide/#1-have-your-application-request-authorization-1
module.exports = {
	renew: () => new Promise((resolve, reject) => {
		axios
			.post(
				'https://accounts.spotify.com/api/token',
				querystring.stringify({
					grant_type: 'client_credentials'
				}),
				{ auth }
			)
			.then(res => {
				if (res.status === 200 && res.data) {
					console.log('token', res.data);
					token = res.data.access_token;
					resolve({
						accessToken: res.data.access_token,
						expiresIn: res.data.expires_in
					});
				}
				else {
					reject(res.data);
				}
			})
	}),
	get: () => {
		return token;
	},
	getHeader: () => {
		return 'Bearer ' + token;
	}
}