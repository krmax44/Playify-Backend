const express = require('express');
const Router = express.Router();
const axios = require('axios');

const errorHandler = require('../handlers/errorHandler');
const dataHandler = require('../handlers/dataHandler');
const tokenHandler = require('../handlers/tokenHandler');

Router.get('/', (req, res) => {
	axios
		.get(
			`https://api.spotify.com/v1/tracks/${encodeURIComponent(req.query.id)}`,
			tokenHandler.getHeader()
		)
		.then(trackData => {
			const { album, artists, name } = trackData.data;

			res.json({
				name,
				album: dataHandler.album(album),
				artists: dataHandler.artists(artists)
			});
		})
		.catch(err => {
			errorHandler.handle(err);
			console.log(err);
			res.json(errorHandler.build(errorHandler.errors.invalidId));
		});
});

module.exports = Router;
