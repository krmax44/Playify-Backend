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

Router.get('/artist', (req, res) => {
    const artistUrl = 'https://api.spotify.com/v1/artists/' + encodeURIComponent(req.query.id);

    axios
        .get(artistUrl, {
            headers: { Authorization: token.getHeader() }
        })
        .then(artistData => {
            const artistMeta = artistData.data;

            const artistAlbums = axios.get(artistUrl + '/albums', {
                headers: { Authorization: token.getHeader() },
                params: { limit: 5, include_groups: 'album,single' }
            });
            
            const artistTracks = axios.get(artistUrl + '/top-tracks', {
                headers: { Authorization: token.getHeader() },
                params: { limit: 10, country: 'US' }
            });

            Promise
                .all([artistAlbums, artistTracks])
                .then(data => {
                    const [artistAlbums, artistTracks] = data;
                    console.log(artistTracks.data);

                    res.json({
                        name: masseur.artist(artistMeta),
                        albums: masseur.albums(artistAlbums.data.items),
                        tracks: masseur.artistTracks(artistTracks.data.tracks)
                    });
                })
                .catch(err => console.error(err));
        })
        .catch(err => {
			res.json(error.build(error.errors.invalidId));
			console.error(err);
		});

});

module.exports = Router;