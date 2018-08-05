const express = require('express');
const Router = express.Router();
const axios = require('axios');
const error = require('../helpers/errorBuilder');
const validateSpotifyId = require('../helpers/validateSpotifyId');
const masseur = require('../helpers/dataMasseurs');
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
			const { album, artists, name } = trackData.data;

			res.json({
				name,
				album: masseur.album(album),
				artists: masseur.artists(artists)
			});
		})
		.catch(err => {
			error.handle(err);
			res.json(error.build(error.errors.invalidId));
		});
});

module.exports = Router;