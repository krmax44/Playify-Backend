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
        .get(`https://api.spotify.com/v1/artists/${encodeURIComponent(req.query.id)}`, {
            headers: { Authorization: tokenHandler.getHeader() }
        })
        .then(artistData => {
            const artistMeta = artistData.data;
            const artistUrl = `https://api.spotify.com/v1/artists/${encodeURIComponent(artistMeta.id)}`;

            const artistAlbums = axios.get(`${artistUrl}/albums`, {
                headers: { Authorization: tokenHandler.getHeader() },
                params: { limit: 5, include_groups: 'album,single' }
            });
            
            const artistTracks = axios.get(`${artistUrl}/top-tracks`, {
                headers: { Authorization: tokenHandler.getHeader() },
                params: { limit: 10, country: 'US' }
            });

            Promise.all([artistAlbums, artistTracks])
                .then(data => {
                    const [artistAlbums, artistTracks] = data;

                    res.json({
                        name: dataHandler.artist(artistMeta),
                        albums: dataHandler.albums(artistAlbums.data.items),
                        tracks: dataHandler.artistTracks(artistTracks.data.tracks)
                    });
                })
                .catch(err => console.error(err));
        })
        .catch(err => {
            errorHandler.handle(err);
			res.json(errorHandler.build(errorHandler.errors.invalidId));
		});

});

module.exports = Router;