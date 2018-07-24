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

Router.get('/artist', (req, res) => {
    const artistUrl = 'https://api.spotify.com/v1/artists/' + encodeURIComponent(req.query.id);

    axios
        .get(artistUrl, {
            headers: { Authorization: token.getHeader() }
        })
        .then(artistData => {
            let artist = {
                name: artistData.data.name,
                images: artistData.data.images
            };

            const artistAlbums = axios.get(artistUrl + '/albums', {
                headers: { Authorization: token.getHeader() },
                params: { limit: 5, include_groups: 'album,single' }
            });
            
            const artistTracks = axios.get(artistUrl + '/top-tracks', {
                headers: { Authorization: token.getHeader() },
                params: { limit: 10, country: 'US' }
            });

            Promise
                .all([artistAlbums,artistTracks])
                .then(data => {
                    console.log(data);
                    artist.albums = data[0].data.items;
                    artist.tracks = data[1].data.tracks;
                    res.json(artist);
                })
                .catch(err => console.error(err));
        })
        .catch(err => {
			res.json(error.build(error.errors.invalidId));
			console.error(err);
		});

});

module.exports = Router;