// see https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids

const errorHandler = require('./errorHandler');

module.exports = (req, res, next) => {
	const { id } = req.query;

	if (id && /^[a-zA-Z0-9]+$/.test(id)) {
		next();
	} else {
		return res.json(errorHandler.build(errorHandler.errors.invalidId));
	}
};
