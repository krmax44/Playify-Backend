const express = require('express');
const Router = express.Router();
const axios = require('axios');

const errorHandler = require('../handlers/errorHandler');
const idHandler = require('../handlers/idHandler');
const dataHandler = require('../handlers/dataHandler');
const tokenHandler = require('../handlers/tokenHandler');

Router.use(idHandler);

Router.get('/', (req, res) => {
	const { headers } = tokenHandler.getHeader();
	axios
		.get(
			`https://api.spotify.com/v1/playlists/${encodeURIComponent(
				req.query.id
			)}`,
			{
				headers,
				params: {
					limit: 100,
					fields:
						'name,description,owner.display_name,tracks(items(track(name,artists,album(artists,name,images))),limit,total)'
				}
			}
		)
		.then(playlistData => {
			const { name, description, owner, tracks } = playlistData.data;
			res.json({
				name,
				description,
				creator: owner.display_name,
				tracks: dataHandler.playlistTracks(tracks.items),
				limit: tracks.limit,
				total: tracks.total,
				page: 0
			});
		})
		.catch(err => {
			errorHandler.handle(err);
			res.json(errorHandler.build(errorHandler.errors.invalidId));
		});
});

Router.get('/:page', (req, res) => {
	const page = parseInt(req.params.page);
	if (!page && page !== 0) {
		return res.json(errorHandler.build(errorHandler.errors.invalidPage));
	}

	const { headers } = tokenHandler.getHeader();

	axios
		.get(
			`https://api.spotify.com/v1/playlists/${encodeURIComponent(
				req.query.id
			)}/tracks`,
			{
				headers,
				params: {
					limit: 100,
					offset: page * 100 || 0,
					fields:
						'limit,total,items(track(name,artists,album(artists,name,images)))'
				}
			}
		)
		.then(playlistData => {
			const { items, limit, total } = playlistData.data;

			if (items.length === 0) {
				return res.json(errorHandler.build(errorHandler.errors.invalidPage));
			}

			res.json({
				tracks: dataHandler.playlistTracks(items),
				limit,
				total,
				page
			});
		})
		.catch(err => {
			errorHandler.handle(err);
			res.json(errorHandler.build(errorHandler.errors.invalidId));
		});
});

module.exports = Router;
