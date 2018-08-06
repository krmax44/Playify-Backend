const axios = require('axios');
const auth = {
	username: process.env.CLIENTID,
	password: process.env.CLIENTSECRET
};
const querystring = require('querystring');

let token = '';

// see https://developer.spotify.com/documentation/general/guides/authorization-guide/#1-have-your-application-request-authorization-1

const renew = () => new Promise((resolve, reject) => {
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
});

const autorenew =  () => {
	return renew()
		.then(data => {
			setTimeout(autorenew, data.expiresIn * 1000 - 20000) // add some spare time
		})
		.catch(err => {
			console.error(err);
			setTimeout(autorenew, 10000); // wait a bit, then try again
		});
};

const get = () => {
	return token;
};

const getHeader = () => {
	return 'Bearer ' + token;
};

module.exports = { renew, autorenew, get, getHeader };