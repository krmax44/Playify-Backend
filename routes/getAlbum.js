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

Router.get('/album', (req, res) => {
	axios
		.get('https://api.spotify.com/v1/albums/' + encodeURIComponent(req.query.id), {
			headers: { Authorization: token.getHeader() }
		})
		.then(albumData => {
			res.json(albumData.data);
		})
		.catch(err => {
			res.json(error.build(error.errors.invalidId));
			console.error(err);
		});
});

module.exports = Router;