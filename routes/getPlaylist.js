const express = require('express');
const Router = express.Router();
const axios = require('axios');
const error = require('../helpers/errorBuilder');
const validateSpotifyId = require('../helpers/validateSpotifyId');
const masseur = require('../helpers/dataMasseurs');
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
		.get(`https://api.spotify.com/v1/users/${encodeURIComponent(req.query.userId)}/playlists/${encodeURIComponent(req.query.id)}`, {
			headers: { Authorization: token.getHeader() },
			params: { limit: 100, fields: 'name,description,owner.display_name,tracks(items(track(name,artists,album(artists,name,images))),limit,total)' }
		})
		.then(playlistData => {
			const { name, description, owner, tracks } = playlistData.data;
			res.json({
				name,
				description,
				creator: owner.display_name,
				tracks: masseur.playlistTracks(tracks.items),
				limit: tracks.limit,
				total: tracks.total,
				page: 0
			});
		})
		.catch(err => {
			res.json(error.build(error.errors.invalidId));
			console.error(err);
		});
});

Router.get('/playlist/:page', (req, res) => {
	const page = parseInt(req.params.page);
	if (!page && page !== 0) {
		return res.json(error.build(error.errors.invalidPage));
	}

	axios
		.get(`https://api.spotify.com/v1/users/${encodeURIComponent(req.query.userId)}/playlists/${encodeURIComponent(req.query.id)}/tracks`, {
			headers: { Authorization: token.getHeader() },
			params: { limit: 100, offset: page * 100 || 0, fields: 'limit,total,items(track(name,artists,album(artists,name,images)))' }
		})
		.then(playlistData => {
			const { items, limit, total } = playlistData.data;

			if (items.length === 0) {
				return res.json(error.build(error.errors.invalidPage));
			}

			res.json({
				tracks: masseur.playlistTracks(items),
				limit,
				total,
				page
			});
		})
		.catch(err => {
			res.json(error.build(error.errors.invalidId));
			console.error(err);
		});
});

module.exports = Router;