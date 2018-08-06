const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});
app.use('/album', require('./routes/getAlbum'));
app.use('/artist', require('./routes/getArtist'));
app.use('/track', require('./routes/getTrack'));
app.use('/playlist', require('./routes/getPlaylist'));

const tokenHandler = require('./handlers/tokenHandler');
tokenHandler
    .autorenew()
    .then(() => {
        app.listen(port); // got a token, open server for requests
    })
    .catch(err => console.err(err));