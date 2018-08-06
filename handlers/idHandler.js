// see https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids

module.exports = {
	id: id => /^[a-zA-Z0-9]+$/.test(id) && id,
	userId: id => /^[^\/\\]+$/.test(id) && id
};