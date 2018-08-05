const artist = $artist => {
	return $artist.name;
};

const artists = $artists => $artists.map($artist => artist($artist));

const album = $album => { 
	return {
		name: $album.name,
		images: $album.images
	}
};

const albums = $albums => $albums.map($album => {
	return {
		name: $album.name,
		images: $album.images,
		id: $album.id
	}
});

const albumTracks = $tracks => $tracks.map($track => {
	return {
		artists: artists($track.artists),
		name: $track.name
	}
});

const artistTracks = $tracks => $tracks.map($track => {
	return {
		artists: artists($track.artists),
		name: $track.name,
		album: album($track.album)
	}
});

const playlistTracks = $tracks => $tracks.map($track => {
	return {
		artists: artists($track.track.artists),
		name: $track.track.name,
		album: album($track.track.album)
	}
});

module.exports = { artist, artists, album, albums, albumTracks, artistTracks, playlistTracks };