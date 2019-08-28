const express = require('express');
const Router = express.Router();
const axios = require('axios');

const errorHandler = require('../handlers/errorHandler');
const dataHandler = require('../handlers/dataHandler');
const tokenHandler = require('../handlers/tokenHandler');

Router.get('/', (req, res) => {
	axios
		.get(
			`https://api.spotify.com/v1/albums/${encodeURIComponent(req.query.id)}`,
			tokenHandler.getHeader()
		)
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
