const express = require('express');
const Router = express.Router();
const axios = require('axios');
const error = require('../helpers/errorBuilder');
const validateSpotifyId = require('../helpers/validateSpotifyId');
const token = require('../helpers/getToken');

Router.use((req, res, next) => {
	if (validateSpotifyId(req.query.id) && validateSpotifyId(req.query.userId)) {
		next();
	}
	else {
		return res.json(error.build(error.errors.invalidId));
	}
});

Router.get('/playlist', (req, res) => {
	axios
		.get('https://api.spotify.com/v1/users/' + encodeURIComponent(req.query.userId) + '/playlists/' + encodeURIComponent(req.query.id), {
			headers: { Authorization: token.getHeader() },
			params: { limit: 100, fields: 'tracks(items(track(artist,album(name,images))),limit,total)' }
		})
		.then(playlistData => {
			res.json(playlistData.data);
		})
		.catch(err => {
			res.json(error.build(error.errors.invalidId));
			console.error(err);
		});
});

Router.get('/playlist/:page', (req, res) => {
	const page = parseInt(req.params.page);
	if (!page) {
		return res.json(error.build(error.errors.invalidPage));
	}

	axios
		.get('https://api.spotify.com/v1/users/' + encodeURIComponent(req.query.userId) + '/playlists/' + encodeURIComponent(req.query.id) + '/tracks', {
			headers: { Authorization: token.getHeader() },
			params: { limit: 100, offset: page * 50 || 0, fields: 'limit,total,items(track(artist,album(name,images)))' }
		})
		.then(playlistData => {
			res.json(playlistData.data);
		})
		.catch(err => {
			res.json(error.build(error.errors.invalidId));
			console.error(err);
		});
});

module.exports = Router;