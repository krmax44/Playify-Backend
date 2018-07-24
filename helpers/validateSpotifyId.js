const error = require('../helpers/errorBuilder');

module.exports = id => /^[a-zA-Z0-9]+$/.test(id) && id; // see https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids