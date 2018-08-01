const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const validateSpotifyId = require('./helpers/validateSpotifyId');

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});
app.use(require('./routes/getAlbum'));
app.use(require('./routes/getArtist'));
app.use(require('./routes/getTrack'));
app.use(require('./routes/getPlaylist'));

const tokenRenewer = require('./helpers/tokenRenewer')();
tokenRenewer
    .then(() => {
        // got a token, open server for requests
        app.listen(port, function () {
            console.log('Server listening at port %d', port);
        });
    })
    .catch(err => console.err(err));