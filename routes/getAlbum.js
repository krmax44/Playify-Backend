const express = require('express');
const Router = express.Router();
const axios = require('axios');

const errorHandler = require('../handlers/errorHandler');
const idHandler = require('../handlers/idHandler');
const dataHandler = require('../handlers/dataHandler');
const tokenHandler = require('../handlers/tokenHandler');

Router.use((req, res, next) => {
	if (idHandler.id(req.query.id)) {
		next();
	}
	else {
		return res.json(errorHandler.build(errorHandler.errors.invalidId));
	}
});

Router.get('/', (req, res) => {
	axios
		.get(`https://api.spotify.com/v1/albums/${encodeURIComponent(req.query.id)}`, {
			headers: { Authorization: tokenHandler.getHeader() }
		})
		.then(albumData => {
			const { artists, name, images, tracks } = albumData.data;
			res.json({
				artists: dataHandler.artists(artists),
				name,
				images,
				tracks: dataHandler.albumTracks(tracks.items)
			});
		})
		.catch(err => {
			errorHandler.handle(err);
			res.json(errorHandler.build(errorHandler.errors.invalidId));
		});
});

module.exports = Router;