const express = require('express');
const Router = express.Router();
const axios = require('axios');
const error = require('../helpers/errorBuilder');
const validateSpotifyId = require('../helpers/validateSpotifyId');
const token = require('../helpers/getToken');

Router.use((req, res, next) => {
	if (validateSpotifyId(req.query.id)) {
		next();
	}
	else {
		return res.json(error.build(error.errors.invalidId));
	}
});

Router.get('/track', (req, res) => {
	axios
		.get('https://api.spotify.com/v1/tracks/' + encodeURIComponent(req.query.id), {
			headers: { Authorization: token.getHeader() }
		})
		.then(trackData => {
			res.json(trackData.data);
		})
		.catch(err => {
			res.json(error.build(error.errors.invalidId));
			console.error(err);
		});
});

module.exports = Router;