const Obj = obj => Object.assign({}, obj);

const artist = $artist => $artist.name;

const artists = $artists => $artists.map($artist => artist($artist));

const album = $album => Obj({
	name: $album.name,
	images: $album.images
});

const albums = $albums => $albums.map($album => Obj({
	name: $album.name,
	images: $album.images,
	id: $album.id
}));

const albumTracks = $tracks => $tracks.map($track => Obj({
	artists: artists($track.artists),
	name: $track.name
}));

const artistTracks = $tracks => $tracks.map($track => Obj({
	artists: artists($track.artists),
	name: $track.name,
	album: album($track.album)
}));

const playlistTracks = $tracks => $tracks.map($track => Obj({
	artists: artists($track.track.artists),
	name: $track.track.name,
	album: album($track.track.album)
}));

module.exports = { artist, artists, album, albums, albumTracks, artistTracks, playlistTracks };